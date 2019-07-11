const moment = require('moment')
const cron = require('node-cron')
const csvManager = require('../db/csvManager')
const sqlManager = require('../db/sqlManager')
const db = require('../db/pool')
const errorMsg = require('../common/errorUtils')

const Lottery = {
    update: async (setJson, whereJson, sqlFunc) => {
        const TABLE_NAME = sqlManager.TABLE_LOTTERY
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_update(func, TABLE_NAME, setJson, whereJson)
        if (!result) {
            return new errorMsg(true, MSG.FAIL_UPDATED_X(WORD))
        }
        return result
    },
    selectAll: async (whereJson, opts, sqlFunc) => {
        const TABLE_NAME = sqlManager.TABLE_LOTTERY
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, MSG.FAIL_READ_X_ALL(WORD))
        }
        return result
    }
}
const Schedule = {
    apply: async (jsonData, sqlFunc) => {
        const WORD = "스케쥴"
        const TABLE_NAME = sqlManager.TABLE_SCHEDULE
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData)
        if (!result) {
            return new errorMsg(true, MSG.FAIL_CREATED_X(WORD))
        }
        return result
    },
    select: async (whereJson, opts, sqlFunc) => {
        const WORD = "스케쥴"
        const TABLE_NAME = sqlManager.TABLE_SCHEDULE
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true,MSG.FAIL_READ_X(WORD))
        }
        if (result.length == 0) {
            return new errorMsg(true, MSG.NO_X(WORD))
        }
        return result[0]
    },
    getList: async (whereJson, opts, sqlFunc) => {
        const WORD = "스케쥴"
        const TABLE_NAME = sqlManager.TABLE_SCHEDULE
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true,  MSG.FAIL_READ_X_ALL(WORD))
        }
        return result
    },
    update: async (setJson, whereJson, sqlFunc) => {
        const WORD = "스케쥴"
        const TABLE_NAME = sqlManager.TABLE_SCHEDULE
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_update(func, TABLE_NAME, setJson, whereJson)
        if (!result) {
            return new errorMsg(true, MSG.FAIL_UPDATED_X(WORD))
        }
        if (result.affectedRows == 0) {
            return new errorMsg(true,  MSG.NO_X(WORD))
        }
        return result
    },
    remove: async (whereJson, sqlFunc) => {
        const WORD = "스케쥴"
        const TABLE_NAME = sqlManager.TABLE_SCHEDULE
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_delete(func, TABLE_NAME, whereJson)
        if (!result) {
            return new errorMsg(true, CODE.DB_ERROR, MSG.FAIL_REMOVED_X(WORD))
        }
        if (result.affectedRows == 0) {
            return new errorMsg(true, CODE.DB_ERROR, MSG.NO_X(WORD))
        }
        return result
    }
}

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
        const scheduleResult = await Schedule.getList({date: dateStr},null , queryStreamFunc)
        if(scheduleResult.isError) {
            throw `error during select Schedule with ${scheduleResult.jsonData}`
        }
        const updateResult = await Schedule.update({drawAvailable: 1}, {date: dateStr}, queryStreamFunc)
        if(updateResult.isError) {
            throw `error during update Schedule with ${updateResult.jsonData}`
        }        
        const csvScheduleList = scheduleResult.map((it)=> convertSchedule4csv(it))
        await csvManager.csvWrite(csvManager.CSV_READY_TO_SCHEDULE_LIST, csvScheduleList)

        if(waitCronList.length != 0)
        {
            for(const it in waitCronList){
                it.end()
            }
        }
        waitCronList = []
        for(const schedule of csvScheduleList) {
            const scheduleIdx = schedule.scheduleIdx
            const tmpDate = new Date(`${schedule.date}T${schedule.startTime}Z`)
            const hour = tmpDate.getUTCHours()
            const minute = tmpDate.getUTCMinutes()

            const cacheTask = new CronWithIndex(scheduleIdx)
            const conditionForCache = `${minute} ${hour - 3} * * *`
            console.log(conditionForCache)
            cacheTask.start(conditionForCache, taskSaveCache)
            
            const chooseTask = new CronWithIndex(scheduleIdx)
            const conditionForChoose = `${minute} ${hour - 2} * * *`
            console.log(conditionForChoose)
            cacheTask.start(conditionForChoose, taskChooseWin)

            waitCronList.push(cacheTask)
            waitCronList.push(chooseTask)
        }
    })
    if(transaction.isError) {
        console.log(transaction.jsonData)
        csvManager.logWrite(csvManager.LOG_TO_UPDATE_AVAILABLE, '매일 10시에 스케쥴 리스트 csv로 저장하기 실패', now)
        setTimeout(() => {
            taskReady2Choose(new Date())
        },60 * 10)
        return
    }
    csvManager.logWrite(csvManager.LOG_TO_UPDATE_AVAILABLE, '매일 10시에 스케쥴 리스트 csv로 저장하기 성공', now)
}
const taskSaveCache = async (scheduleIdx) => {
    console.log(`Database에서 추첨을 해야할 정보를 미리 파일로 가져온다.`)
    console.log(scheduleIdx)
    
    const whereJson = {scheduleIdx: scheduleIdx}
    const opts = {}
    const lotteryResult = await Lottery.selectAll(whereJson, opts)
    if (lotteryResult.isError == true) {
        console.log(`error ${lotteryResult.jsonData}`)
        await csvManager.logWrite(csvManager.LOG_DURING_SAVE_CACHE, 'fail to read lotteryList')
        setTimeout(() => {
            taskSaveCache(scheduleIdx)
        },60 * 10 * 60)
        return
    }
    const csvJson = lotteryResult.map((it) => convertLottery4csv(it))

    const result  = await csvManager.csvWriteSync(csvManager.CSV_LOTTERY_LIST_WITH_SCHEDULE_CACHE(scheduleIdx), csvJson)
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
const taskChooseWin = async (scheduleIdx) => {
    console.log(`당첨 로터리 티켓 고르기`)
    
    // 1. 로터리 리스트 가져오기 (from file)
    let cacheLotteryList = await csvManager.csvReadSync(csvManager.CSV_LOTTERY_LIST_WITH_SCHEDULE_CACHE(scheduleIdx))
    if(cacheLotteryList.isError == true){        
        cacheLotteryList = await Lottery.selectAll({scheduleIdx: scheduleIdx}, {})
        if(cacheLotteryList.isError == true){
            await csvManager.logWrite(csvManager.LOG_DURING_CHOOSE_WIN, `로터리 당첨 선발중에 에러가 발생했습니다...${cacheLotteryList.jsonData}`)
            return
        }
    }
    const resultSchedule = await Schedule.select({scheduleIdx: scheduleIdx})
    if(resultSchedule.isError == true){
        await csvManager.logWrite(csvManager.LOG_DURING_CHOOSE_WIN, `로터리 당첨 선발중에 에러가 발생했습니다...${resultSchedule.jsonData}`)
        return
    }
    if(resultSchedule.length == 0){
        await csvManager.logWrite(csvManager.LOG_DURING_CHOOSE_WIN, "로터리 당첨 선발중에 에러가 발생했습니다... [해당되는 스케쥴이 없습니다.]")
        return
    }
    console.log(resultSchedule)
    if(resultSchedule.done == 1 ){
        await csvManager.logWrite(csvManager.LOG_DURING_CHOOSE_WIN, "로터리 당첨 선발중에 에러가 발생했습니다... [이미 당첨 프로세스를 거친 스케쥴입니다.]")
        return
    }
    
    // 2. random 알고리즘
    const randomIdx = parseInt(Math.random() * 1000) % cacheLotteryList.length
    const winLottery = cacheLotteryList[randomIdx]
    if(!winLottery.lotteryIdx){
        await csvManager.logWrite(csvManager.LOG_DURING_CHOOSE_WIN, "로터리 당첨 선발중에 에러가 발생했습니다...")
        return
    }
    csvManager.logWrite(csvManager.LOG_DURING_CHOOSE_WIN, `scheduleIdx:${scheduleIdx}/ winLotteryIdx is ${winLottery.lotteryIdx}`)

    
    // db update(트랜잭션 처리)
    const transaction = await db.Transaction(async (connection) => {
        const queryStreamFunc = (query, value) => {
            return connection.queryStream(query, value)
        }
        const resultUpdate = await Schedule.update({done: 1}, {scheduleIdx: scheduleIdx}, queryStreamFunc)
        const resultLottery = await Lottery.update({state: 1}, {lotteryIdx: winLottery.lotteryIdx})
    })
    if(!transaction){
        return new errorMsg(false,  Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_UPDATED_X(WORD)))
    }
    console.log(transaction)
    //FCM을 보낸다

    // csv 정보를 clear한다.
    return transaction
}
const scheduler = {
    startCron: () => {
        console.log("start Cron")
        const taskWhen10oClock = cron.schedule('*/1 * * * *', () => {        
        // const taskWhen10oClock = cron.schedule('0 10 * * *', () => {        
            console.log("10시 에 실행")
            console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
            taskReady2Choose(new Date())
        })
        cronList.push(taskWhen10oClock)
    },
    stopCron: () => {
        console.log("stop Cron")
        for (const schedule in cronList) {
            schedule.stop()
        }
    },
    endCron: () => {
        console.log("end Cron")
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
    await taskSaveCache(60)
}
const test_taskChooseWin = async () => {
    await taskChooseWin(60)
}
const test_module = async () => {
    scheduler.startCron()
    // test_taskReady2Choose_reset()
    // await test_taskSavaCache()
    // test_taskReady2Choose()
    // test_taskChooseWin()
}
// test_module()