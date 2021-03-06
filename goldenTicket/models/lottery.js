const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const Utils = require('../modules/utils/rest/utils')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')
const Schedule = require('../models/schedule')
const WORD = '응모'
const TABLE_NAME = sqlManager.TABLE_LOTTERY

const lotteryModule = {
    apply: async (jsonData, sqlFunc) => {
        if (jsonData.userIdx == undefined || jsonData.scheduleIdx == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.NULL_VALUE))
        }
        const lottery = {
            userIdx: jsonData.userIdx,
            scheduleIdx: jsonData.scheduleIdx,
            seat: 1
        }
        const func = sqlFunc || db.queryParam_Parse
        const condition = `SELECT * FROM lottery WHERE userIdx = ${lottery.userIdx} AND scheduleIdx = ${lottery.scheduleIdx}`
        const result2 = await func(condition)
        const condition2 = `SELECT * FROM lottery WHERE userIdx = ${lottery.userIdx}`
        const result3 = await func(condition2)
        console.log(result3.length)
        //중복해서 응모할 수 없음
        if (result2 != 0){
            return new errorMsg(true, Utils.successTrue(CODE.NO_CONTENT, MSG.ALREADY_X(WORD)))
        }
        //최대 두개까지만 응모 가능
        if (result3.length == 2){
            return new errorMsg(true, Utils.successTrue(CODE.RESET_CONTENT, MSG.ALREADY_LOTTERY_X(WORD)))
        }
        const result = await sqlManager.db_insert(func, TABLE_NAME, lottery)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        if (result.isError == true) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.FAIL_DB_READ))
        }
        return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.CREATED_X(WORD)))
    },
    update: async (setJson, whereJson, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_update(func, TABLE_NAME, setJson, whereJson)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_UPDATED_X(WORD)))
        }
        return result
    },
    select: async (whereJson, sqlFunc) => {
        const selectQuery = 'SELECT ticket.ticketIdx, win.state '+
        'FROM (SELECT * FROM lottery '+
        `WHERE lottery.userIdx = ${whereJson.userIdx} AND lottery.lotteryIdx = ${whereJson.lotteryIdx}) win, ticket `+
        'WHERE win.userIdx=ticket.userIdx AND win.scheduleIdx=ticket.scheduleIdx'
        const result = await db.queryParam_None(selectQuery)
        //애초에 응모하지 않은 티켓을 찾기 위한 쿼리
        const xLotteryQuery = 'SELECT * FROM lottery '+
        `WHERE lottery.userIdx = ${whereJson.userIdx} AND lottery.lotteryIdx = ${whereJson.lotteryIdx}`
        const subResult = await db.queryParam_None(xLotteryQuery)
        if (result.length == undefined) { 
            console.log('서버 에러')
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        if(result == 0) {
            if(subResult == 0){
                console.log('존재하지 않는 응모티켓 조회')
                return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.FAIL_READ_X(WORD)))
            }
        }
        console.log("당첨 된 응모티켓 조회")
        return result
    },
    selectAll: async (whereJson) => {
        const selectAllQuery = 'SELECT * ' +
        'FROM (SELECT show.showIdx, show.name, schedule.startTime, schedule.date, lottery.lotteryIdx, lottery.userIdx ' +
        'FROM (( `show` INNER JOIN schedule ON show.showIdx = schedule.showIdx)' +
        'INNER JOIN lottery ON schedule.scheduleIdx = lottery.scheduleIdx)) AS a ' +
        `WHERE a.userIdx = ${whereJson.userIdx}`
        const result = await db.queryParam_None(selectAllQuery)
        if(!result)
        {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        if (result.length == 0) {
            return result
        }
        let resultArray = []
        for(var i=0; i<result.length; i++)
        {
            resultArray.push(result[i])
        }
        return result
    },
    delete: async (whereJson, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_delete(func, TABLE_NAME, whereJson)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_REMOVED_X(WORD)))
        }
        if (result.affectedRows == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.NO_X(WORD)))
        }
        return result
    },
    chooseWin: async (cacheLotteryList, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const resultSchedule = await Schedule.select(whereJson, func)
        if(resultSchedule.isError == true){
            return new errorMsg(false, resultSchedule.jsonData)
        }
        if(resultSchedule.length == 0){
            return new errorMsg(false, MSG.NO_X(`추첨된 ${WORD}`))
        }
        console.log(resultSchedule)
        if(resultSchedule.done == 1){
            return new errorMsg(false, MSG.ALREADY_X(`추첨된 ${WORD}`))
        }
        
        const randomIdx = parseInt(Math.random() * 1000) % cacheLotteryList.length
        const winLottery = cacheLotteryList[randomIdx]
        console.log(winLottery)
        const transaction = await db.Transaction(async (connection) => {
            const queryStreamFunc = (query, value) => {
                return sqlFunc || connection.queryStream(query, value)
            }
            const resultUpdate = await Schedule.update({done: 1}, {scheduleIdx: winLottery.schedule_idx}, queryStreamFunc)
            const resultLottery = await lotteryModule.update({state: 1}, {lotteryIdx: winLottery.lottery_idx})
        })
        if(!transaction){
            return new errorMsg(false,  Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_UPDATED_X(WORD)))
        }
        return transaction
    }
}
module.exports = lotteryModule
// module test
const apply_test = async () => {
    console.log('DB TEST [ Lottery : apply]')
    const result = await lotteryModule.apply({
        userIdx: 4,
        scheduleIdx: 30
    })
    console.log(result)
}
const select_test = async () => {
    console.log('DB TEST [ Lottery : select]')
    const result = await lotteryModule.select({
        userIdx: 4
    })
    console.log(result)
}
const selectAll_test = async () => {
    console.log('DB TEST [ Lottery : selectAll]')
    const result = await lotteryModule.selectAll({
        userIdx: 4
    })
    console.log(result)
}
const delete_test = async () => {
    console.log('DB TEST [ Lottery : delete]')
    const result = await lotteryModule.delete({
        lotteryIdx: 10
    })
    console.log(result)
}
const chooseWin_test = async () => {
    console.log('DB TEST [ Lottery : chooseWin]')
    const result = await lotteryModule.chooseWin({
        scheduleIdx: 30
    })
    console.log(result)
}
const module_test = async () => {
    // await apply_test()
    // await select_test()
    // await selectAll_test()
    // await delete_test()
    // await chooseWin_test()
}
module_test()
