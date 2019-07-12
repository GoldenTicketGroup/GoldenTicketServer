const moment = require('moment')
const cron = require('node-cron')
const sqlManager = require('../db/sqlManager')
const db = require('../db/pool')
const errorMsg = require('../common/errorUtils')
const responseMessage = require('../rest/responseMessage')
const csvManager = require('../db/csvManager')

const fcmFunc = async (userIdx, title, content) => {
    console.log(title+ " " + content)
}
const User = {
    get: async (userIdx) => {
        const TABLE_NAME = sqlManager.TABLE_USER
        const WORD = '유저'
        const userResult = await sqlManager.db_select(db.queryParam_Parse, TABLE_NAME, {userIdx: userIdx}, {})
        if(userResult.isError){
            return new errorMsg(true, responseMessage.FAIL_READ_X(WORD))
        }
        return userResult[0]
    }
}
const Show = {
    get: async (showIdx) => {
        const TABLE_NAME = sqlManager.TABLE_SHOW
        const WORD = '공연'
        const showResult = await sqlManager.db_select(db.queryParam_Parse, TABLE_NAME, {showIdx: showIdx}, {})
        if(showResult.isError){
            return new errorMsg(true, responseMessage.FAIL_READ_X(WORD))
        }
        return showResult[0]
    }
}
const Like = {
    isLikedUserList: async(showIdx) => {
        const TABLE_NAME = sqlManager.TABLE_LIKE
        const WORD = '좋아요 체크'
        const likeResult = await sqlManager.db_select(db.queryParam_Parse, TABLE_NAME, {showIdx: showIdx}, {fields: 'userIdx'})
        if(likeResult.isError) {
            return new errorMsg(true, responseMessage.FAIL_READ_X(WORD))
        }
        return likeResult
    }
}

const Lottery = {
    update: async (setJson, whereJson, sqlFunc) => {
        const TABLE_NAME = sqlManager.TABLE_LOTTERY
        const WORD = '로터리'
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_update(func, TABLE_NAME, setJson, whereJson)
        if (!result) {
            return new errorMsg(true, responseMessage.FAIL_UPDATED_X(WORD))
        }
        return result
    },
    selectAll: async (whereJson, opts, sqlFunc) => {
        const TABLE_NAME = sqlManager.TABLE_LOTTERY
        const WORD = '로터리'
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, responseMessage.FAIL_READ_X_ALL(WORD))
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
            return new errorMsg(true, responseMessage.FAIL_CREATED_X(WORD))
        }
        return result
    },
    select: async (whereJson, opts, sqlFunc) => {
        const WORD = "스케쥴"
        const TABLE_NAME = sqlManager.TABLE_SCHEDULE
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true,responseMessage.FAIL_READ_X(WORD))
        }
        if (result.length == 0) {
            return new errorMsg(true, responseMessage.NO_X(WORD))
        }
        return result[0]
    },
    getList: async (whereJson, opts, sqlFunc) => {
        const WORD = "스케쥴"
        const TABLE_NAME = sqlManager.TABLE_SCHEDULE
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, responseMessage.FAIL_READ_X_ALL(WORD))
        }
        return result
    },
    update: async (setJson, whereJson, sqlFunc) => {
        const WORD = "스케쥴"
        const TABLE_NAME = sqlManager.TABLE_SCHEDULE
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_update(func, TABLE_NAME, setJson, whereJson)
        if (!result) {
            return new errorMsg(true, responseMessage.FAIL_UPDATED_X(WORD))
        }
        if (result.affectedRows == 0) {
            return new errorMsg(true,  responseMessage.NO_X(WORD))
        }
        return result
    },
    remove: async (whereJson, sqlFunc) => {
        const WORD = "스케쥴"
        const TABLE_NAME = sqlManager.TABLE_SCHEDULE
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_delete(func, TABLE_NAME, whereJson)
        if (!result) {
            return new errorMsg(true, CODE.DB_ERROR, responseMessage.FAIL_REMOVED_X(WORD))
        }
        if (result.affectedRows == 0) {
            return new errorMsg(true, CODE.DB_ERROR, responseMessage.NO_X(WORD))
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
    destroy() {
        if(!this.currentTask) return
        this.currentTask.destroy()
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
        if(scheduleResult.length==0){
            return
        }
        const updateResult = await Schedule.update({drawAvailable: 1}, {date: dateStr}, queryStreamFunc)
        if(updateResult.isError) {
            throw `error during update Schedule with ${updateResult.jsonData}`
        }        
        const csvScheduleList = scheduleResult.map((it)=> convertSchedule4csv(it))

        const userMap = {}
        for(const schedule of csvScheduleList) {
            const showIdx = schedule.showIdx
            const showResult = await Show.get(showIdx)
            if(showResult.isError){
                throw `error during read Show with ${showResult.jsonData}`
            }
            const showName = showResult.name
            const userListResult = await Like.isLikedUserList(showIdx)
            for(const user of userListResult){
                const userIdx = user.userIdx
                if(userMap[userIdx] == undefined){
                    userMap[userIdx] = [showName]
                    continue
                }
                if(!userMap[userIdx].includes(showName)){
                    userMap[userIdx].push(showName)
                }
            }
        }
        for(const userIdx of Object.keys(userMap)){
            const showNameList = userMap[userIdx]
            const userResult = await User.get(userIdx)
            if(userResult.isError){
                throw `error during read Show with ${userResult.jsonData}`
            }
            const userName = userResult.name
            let showNameStr = ""
            if(showNameList.length == 1){
                showNameStr = showNameList[0]
            }
            else if(showNameList.length == 2){
                showNameStr = `${showNameList[0]}, ${showNameList[1]}`
            }
            else if(showNameList.length > 2){
                showNameStr = `${showNameList[0]}, ${showNameList[1]} 외 ${(showNameList.length - 2)}개`
            }
            fcmFunc(userIdx, `${userName}님, ${showNameStr}의 관심있는 공연 응모가 시작되었습니다!`, '골든티켓의 주인공이 되어보세요!')
        }
        
        for(const it of waitCronList){
            it.destroy()
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
        // setTimeout(() => {
        //     taskReady2Choose(new Date())
        // },60 * 10 * 5)
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
        // setTimeout(() => {
        //     taskSaveCache(scheduleIdx)
        // },60 * 10 * 60)
        return
    }
    const csvJson = lotteryResult.map((it) => convertLottery4csv(it))

    const result  = await csvManager.csvWriteSync(csvManager.CSV_LOTTERY_LIST_WITH_SCHEDULE_CACHE(scheduleIdx), csvJson)
    console.log(result)
    if (!result) {
        console.log('error on save cache lottery')
        await csvManager.logWrite(csvManager.LOG_DURING_SAVE_CACHE, 'fail to save result as csv file')
        // setTimeout(() => {
        //     taskSaveCache(scheduleIdx)
        // },60 * 10 * 60)
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
        return new errorMsg(false,  Utils.successFalse(CODE.DB_ERROR, responseMessage.FAIL_UPDATED_X(WORD)))
    }
    console.log(transaction)
    //FCM을 보낸다
    const showResult = await Show.get(resultSchedule.showIdx)
    if(showResult.isError){
        return new errorMsg(false,  Utils.successFalse(CODE.DB_ERROR, responseMessage.FAIL_READ_X('공연')))
    }
    const showName = showResult.name
    for(const lottery of cacheLotteryList){
        const userIdx = lottery.userIdx
        const userResult = await User.get(userIdx)
        const userName = userResult.name
        fcmFunc(userIdx, `${userName}님, 두근두근 결과가 나왔습니다!`, `응모하신 '${showName}'의 당첨결과를 확인해보세요!`)
    }

    // csv 정보를 clear한다.
    return transaction
}
const scheduler = {
    startCron: () => {
        console.log("start Cron")
        // const taskWhen10oClock = cron.schedule('*/1 * * * *', () => {        
        const taskWhen10oClock = cron.schedule('0 10 * * *', () => {        
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
    },
    forceReady2Choose: (date) => {
        if(!date) return false
        taskReady2Choose(date)
    },
    forceSaveCache: (scheduleIdx) => {
        if(!scheduleIdx) return false
        taskSaveCache(scheduleIdx)
    },
    forceChooseWin: (scheduleIdx) => {
        if(!scheduleIdx) return false
        taskChooseWin(scheduleIdx)
    }
}
module.exports = scheduler
const test_taskReady2Choose = async () => {
    const now = new Date('2019-07-12')
    await taskReady2Choose(now)
}
const test_taskReady2Choose_reset = async () => {   
    const now = new Date('2019-07-12')
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
    //scheduler.startCron()
    // test_taskReady2Choose_reset()
    // test_taskReady2Choose()
    // test_taskReady2Choose()
    // await test_taskSavaCache()
    // test_taskReady2Choose()
    // test_taskChooseWin()
}
// test_module()
