const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const Utils = require('../modules/utils/rest/utils')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')
const Schedule = require('../models/schedule')

const WORD = '응모'
const TABLE_NAME = sqlManager.TABLE_LOTTERY

const convertLottery = (lotteryData) => {
    return {
        lottery_idx: lotteryData.lotteryIdx,
        schedule_idx: lotteryData.scheduleIdx,
        user_idx: lotteryData.userIdx,
        seat: lotteryData.seat,
        state: lotteryData.state,
        created_time: lotteryData.createdTime
    }
}
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
        //중복해서 응모할 수 없음
        if (result2 != 0){
            return new errorMsg(true, Utils.successFalse(CODE.FORBIDDEN, MSG.ALREADY_X(WORD)))
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
    select: async (whereJson, opts, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        const condition = `SELECT * FROM lottery WHERE lotteryIdx = ${whereJson.lotteryIdx}`
        const result2 = await func(condition)

        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        if (result2.length == 0) { //존재하지 않는 티켓을 조회했을 때
            if (result.length == 0) {
                return new errorMsg(true, Utils.successFalse(CODE.NOT_FOUND, MSG.NO_X(WORD)))
            }
        }
        if (result2.length) { //존재하는 티켓이지만 당첨되지 않은 티켓을 조회했을 때
            if (result.length == 0) {
                return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.OK_NO_X(WORD)))
            }
            return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.READ_X(WORD), convertLottery(result[0])))
        }
    },
    selectAll: async (whereJson, opts, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.OK_NO_X(WORD), result.map(it => convertLottery(it))))    
        }
        return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.READ_X_ALL(WORD), result.map(it => convertLottery(it))))
    },
    delete: async (whereJson, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_delete(func, TABLE_NAME, whereJson)
        console.log(result)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_REMOVED_X(WORD)))
        }
        if (result.affectedRows == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_X(WORD)))
        }
        return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.REMOVED_X(WORD)))
    },
    chooseWin: async (whereJson, sqlFunc) => {
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
        const resultList = await lotteryModule.selectAll(whereJson, func)
        if(resultList.isError == true) {
            return new errorMsg(false, resultList.jsonData)
        }
        const randomIdx = parseInt(Math.random() * 1000) % resultList.length
        const winLottery = resultList[randomIdx]
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
