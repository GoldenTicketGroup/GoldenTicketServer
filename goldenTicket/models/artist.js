const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const errorMsg = require('../modules/utils/common/errorUtils')
const Utils = require('../modules/utils/rest/utils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')

const WORD = '아티스트'
const TABLE_NAME = sqlManager.TABLE_CARD

const convertCard = (cardData) => {
    return {
        // 아래 내용은 그냥 임시
        post_idx: cardData.postIdx,
        schedule_idx: cardData.scheduleIdx,
        user_idx: cardData.userIdx,
        seat: cardData.seat,
        win: cardData.win,
        created_time: cardData.createdTime
    }
}
module.exports = {
    insert: async (jsonData, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        if (result.isError == true && result.jsonData === MSG.NULL_VALUE) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, result.jsonData))
        }
        if (result.isError == true) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, result.jsonData))
        }
        return result
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
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.NOT_FOUND, MSG.NO_X(WORD)))
        }
        return result[0]
    },
    selectAll: async (whereJson, opts, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        return result
    }
}