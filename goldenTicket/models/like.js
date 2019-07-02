const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')
const Utils = require('../modules/utils/rest/utils')
const WORD = `좋아요`
const TABLE_NAME = sqlManager.TABLE_LIKE

module.exports = {
    like: async (showIdx, userIdx, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const jsonData = {
            showIdx: parseInt(showIdx),
            userIdx: userIdx
        }
        const selectResult = await sqlManager.db_select(func, TABLE_NAME, jsonData)
        console.log("........")
        console.log(selectResult)
        console.log("........")

        if (selectResult.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        if (selectResult.length != 0) {
            return new errorMsg(true, Utils.successFalse(CODE.NOT_MODIFIED, MSG.ALREADY_LIKE_X))
        }
        const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData)
        console.log(result)
        if (!result && !jsonData.showIdx) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.NULL_VALUE))
        }
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        return result
    },
    unlike: async (showIdx, userIdx, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const whereJson = {
            showIdx: showIdx,
            userIdx: userIdx
        }
        const result = await sqlManager.db_delete(func, TABLE_NAME, whereJson)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_REMOVED_X(WORD)))
        }
        return result
    }
}