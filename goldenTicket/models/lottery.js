const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')

const WORD = '응모'
const convertLottery = (lotteryData) => {
    return {
        // 아래 내용은 그냥 임시
        lottery_idx: lotteryData.lotteryIdx,
        schedule_idx: lotteryData.scheduleIdx,
        user_idx: lotteryData.userIdx,
        seat: lotteryData.seat,
        win: lotteryData.win,
        created_time: lotteryData.createdTime
    }
}
module.exports = {
    insert: async (jsonData) => {
        const result = await sqlManager.db_insert(db.queryParam_Parse, sqlManager.TABLE_LOTTERY, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        return result
    },
    update: async (setJson, whereJson) => {
        const result = await sqlManager.db_update(db.queryParam_Parse, sqlManager.TABLE_LOTTERY, setJson, whereJson)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_UPDATED_X(WORD)))
        }
        return result
    },
    select: async (whereJson) => {
        const result = await sqlManager.db_select(db.queryParam_Parse, sqlManager.TABLE_LOTTERY, whereJson)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_X(WORD)))
        }
        return convertLottery(result[0])
    },
    selectAll: async (whereJson, opts) => {
        const result = await sqlManager.db_select(db.queryParam_Parse, sqlManager.TABLE_LOTTERY, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        return result.map(it => convertLottery(it))
    }
}