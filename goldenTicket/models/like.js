const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')

const WORD = `좋아요`
const TABLE_NAME = sqlManager.TABLE_LIKE

module.exports = {
    like: async (showIdx, userIdx, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const jsonData = {
            showIdx: showIdx,
            userIdx: userIdx
        }
        const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData)
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