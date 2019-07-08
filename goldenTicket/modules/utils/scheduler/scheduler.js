const moment = require('moment')
const cron = require('node-cron')
const csvManager = require('../db/csvManager')
const Lottery = require('../../../models/lottery')
const Schedule = require('../../../models/schedule')
const db = require('../db/pool')

const scheduleList = []

const convertSchedule4csv = (it) => {
    return {
        scheduleIdx: it.scheduleIdx, 
        date: it.date, 
        startTime: it.startTime,
        endTime: it.endTime,
        showIdx: it.showIdx
    }
}
const taskReady2Choose = async (now) => {
    console.log(`응모 가능항 상태를 만든다`)
    const nowMoment = moment(now)
    const dateStr = nowMoment.format("YYYY-MM-DD")

    const transaction = await db.Transaction(async (connection) => {
        const queryStreamFunc = (query, value) => {
            return connection.query(query, value)
        }
        const scheduleResult = await Schedule.getList({date: dateStr}, {}, queryStreamFunc)
        if(scheduleResult.isError) {
            throw `error during select Schedule with ${scheduleResult.jsonData}`
        }
        const updateResult = await Schedule.update({drawAvailable: 1}, {date: dateStr}, queryStreamFunc)
        if(updateResult.isError) {
            throw `error during update Schedule with ${updateResult.jsonData}`
        }
        
        const csvScheduleList = scheduleResult.map((it)=> convertSchedule4csv(it))
        await csvManager.csvWrite(csvManager.CSV_READY_TO_LOTTERY_LIST, csvScheduleList)
    })
    if(transaction.isError) {
        console.log(transaction.jsonData)
        csvManager.logWrite(csvManager.LOG_TO_UPDATE_AVAILABLE, now, '매일 10시에 스케쥴 리스트 csv로 저장하기 실패')
        setTimeout(() => {
            taskReady2Choose(new Date())
        },60 * 10)
        return
    }
    csvManager.logWrite(csvManager.LOG_TO_UPDATE_AVAILABLE,now, '매일 10시에 스케쥴 리스트 csv로 저장하기 성공')
}
const taskSaveCache = () => {
    console.log("1시간 마다(30분에) 실행");
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
    console.log(`Database에서 추첨을 해야할 정보를 미리 파일로 가져온다.`);
    // 30분 이후 추첨에 사용될 데이터를 미리 database에서 가져온다.
    // csv에 저장한다.
    const whereJson = {}
    const opts = {}
    const resultList = Lottery.selectAll(whereJson, opts)
    if (resultList.isError == true) {
        console.log('error' + resultList.jsonData)
        csvManager.csvWrite('cacheLotterList', resultList)
        return
    }
}
const taskChoseWin = () => {
    console.log("1시간 마다 실행")
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
    console.log(`한시간 마다 push보내야할 로터리 확인 해야한다.`)
    // 로터리 리스트 가져오기 (from file)
    // random 알고리즘
    // db update(트랜잭션 처리) //이부분에서 메모리 초과 일어날 것같음. 추후에 update를 하기전에 csv로 저장하고 db로 업데이트
    // fcm 메세지 보내기
    // csv 정보를 clear한다.
}
const scheduler = {
    startCron: () => {
        const taskWhen10oClock = cron.schedule('0 10 * * *', () => {        
            console.log("10시 에 실행")
            console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
            taskReady2Choose()
        })
        // 10시 30분 부터 22시 30분 까지 1시간 마다 실행
        // csv로 미리 db에서 파일로 옮겨놓음 (캐시 역할), 
        const task3 = cron.schedule('30 10-22/1 * * *', () => {
            taskSaveCache()
        })
        // 10시부터 22시까지 1시간 마다실행
        const task2 = cron.schedule('0 10-22/1 * * *', () => {
            taskChoseWin()
        })
        scheduleList.push(taskWhen10oClock)
        scheduleList.push(task2)
        scheduleList.push(task3)
    },
    stopCron: () => {
        for (const schedule in scheduleList) {
            schedule.stop()
        }
    },
    endCron: () => {
        for (const schedule in scheduleList) {
            schedule.destroy()
        }
    }
}
module.exports = scheduler
const test_taskReady2Choose = async () => {
    const now = new Date('2019-07-07')
    await taskReady2Choose(now)
}
const test_taskReady2Choose_reset = async () => {   
    const now = new Date('2019-07-07')
    const nowMoment = moment(now)
    const dateStr = nowMoment.format("YYYY-MM-DD")
    await Schedule.update({drawAvailable: 0}, {date: dateStr})
}
const test_module = async () => {
    // scheduler.startCron()
    test_taskReady2Choose_reset()
    test_taskReady2Choose()
}
//test_module()