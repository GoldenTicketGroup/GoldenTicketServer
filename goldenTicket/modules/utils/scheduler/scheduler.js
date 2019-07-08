const moment = require('moment')
const cron = require('node-cron')
const csvManager = require('../db/csvManager')
const Lottery = require('../../../models/lottery')
const Schedule = require('../../../models/schedule')
const db = require('../db/pool')

const cronList = []
let waitCronList = []

class CronWithIndex {
    constructor(scheduleIdx) {
        this.scheduleIdx = scheduleIdx
        this.currentTask = null
    }
    start(condition, func) {
        console.log(`add cron(${condition}) with func`)
        this.currentTask = cron.schedule(condition, async () => {        
            console.log(condition)
            console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
            await func(this.scheduleIdx)
            this.stop()
            this.currentTask = null
        })
        return this.currentTask
    }
    stop() {
        if(!this.currentTask) return
        this.currentTask.stop()
    }
    end() {
        if(!this.currentTask) return
        this.currentTask.end()
    }
}
const convertSchedule4csv = (it) => {
    return {
        scheduleIdx: it.scheduleIdx, 
        date: it.date, 
        startTime: it.startTime,
        endTime: it.endTime,
        showIdx: it.showIdx
    }
}
const convertLottery4csv = (it) => {
    return {
        lotteryIdx: it.lotteryIdx, 
        scheduleIdx: it.scheduleIdx, 
        seat: it.seat, 
        state: it.state,
        userIdx: it.userIdx
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
        await csvManager.csvWrite(csvManager.CSV_READY_TO_SCHEDULE_LIST, csvScheduleList)

        waitCronList = []
        for(const schedule of csvScheduleList) {
            const scheduleIdx = schedule.scheduleIdx
            const waitTask = new CronWithIndex(scheduleIdx)
            const tmpDate = new Date(`${schedule.date}T${schedule.startTime}Z`)
            const hour = tmpDate.getUTCHours()
            const minute = tmpDate.getUTCMinutes()
            const condition = `${minute} ${hour} * * *`
            console.log(condition)
            waitTask.start(condition, taskSaveCache)
            waitCronList.push(waitTask)
        }
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
const taskSaveCache = async (scheduleIdx) => {
    console.log(`Database에서 추첨을 해야할 정보를 미리 파일로 가져온다.`)
    console.log(scheduleIdx)
    const schedule = await csvManager.csvReadSingle(csvManager.CSV_READY_TO_SCHEDULE_LIST, scheduleIdx)
    console.log(schedule)
    
    const whereJson = {scheduleIdx: scheduleIdx}
    const opts = {}
    const lotteryResult = await Lottery.selectAll(whereJson, opts)
    if (lotteryResult.isError == true) {
        console.log('error' + resultList.jsonData)
        await csvManager.logWrite(csvManager.LOG_DURING_SAVE_CACHE, 'fail to read lotteryList')
        setTimeout(() => {
            taskSaveCache(scheduleIdx)
        },60 * 10)
        return
    }
    const csvJson = {
        showIdx: showIdx,
        lotteryList: lotteryResult.map((it) => convertLottery4csv(it))
    }
    const result  = await csvManager.csvWrite(csvManager.CSV_LOTTERY_LIST_WITH_SCHEDULE_CACHE(scheduleIdx), csvJson)
    console.log(result)
    if (!result) {
        console.log('error on save cache lottery')
        await csvManager.logWrite(csvManager.LOG_DURING_SAVE_CACHE, 'fail to save result as csv file')
        setTimeout(() => {
            taskSaveCache(scheduleIdx)
        },60 * 10)
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
        // csv로 미리 db에서 파일로 옮겨놓음 (캐시 역할)
        const taskEvery30Minute = cron.schedule('30 10-22/1 * * *', () => {
            console.log("1시간 마다(30분에) 실행")
            console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
            taskSaveCache()
        })
        // 10시부터 22시까지 1시간 마다실행
        const task2 = cron.schedule('0 10-22/1 * * *', () => {
            taskChoseWin()
        })
        cronList.push(taskWhen10oClock)
        cronList.push(task2)
        cronList.push(taskEvery30Minute)
    },
    stopCron: () => {
        for (const schedule in cronList) {
            schedule.stop()
        }
    },
    endCron: () => {
        for (const schedule in cronList) {
            schedule.destroy()
        }
    }
}
module.exports = scheduler
const test_taskReady2Choose = async () => {
    const now = new Date('2019-07-08')
    await taskReady2Choose(now)
}
const test_taskReady2Choose_reset = async () => {   
    const now = new Date('2019-07-08')
    const nowMoment = moment(now)
    const dateStr = nowMoment.format("YYYY-MM-DD")
    await Schedule.update({drawAvailable: 0}, {date: dateStr})
}
const test_taskSavaCache = async () => {
    await taskSaveCache(30)
}
const test_module = async () => {
    // scheduler.startCron()
    // test_taskReady2Choose_reset()
    await test_taskSavaCache()
    // test_taskReady2Choose()
}
test_module()