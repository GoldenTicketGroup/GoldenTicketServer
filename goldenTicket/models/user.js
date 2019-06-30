const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')

const TABLE_NAME = sqlManager.TABLE_USER

const convertUser = (userData) => {
    return {
        // 아래 내용은 그냥 임시
        user_idx: userData.TicketIdx,
        schedule_idx: userData.scheduleIdx,
        user_idx: userData.userIdx,
        seat: userData.seat,
        win: userData.win,
        created_time: userData.createdTime
    }
}
const userModule = {
    signUp: async (jsonData, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        return result
    },
    update: async (setJson, whereJson, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_update(func, TABLE_NAME, setJson, whereJson)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_UPDATED_USER))
        }
        return result
    },
    select: async (whereJson, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, sqlManager.TABLE_TICKET, whereJson)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_USER))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_USER))
        }
        return convertUser(result[0])
    },
    selectAll: async (whereJson, opts, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_USER_ALL))
        }
        return result.map(it => convertUser(it))
    }
}
module.exports = userModule

const module_test = async () => { 
    let result
    console.log('HASHTAG : register Test')
    result = await userModule.signUp({})
    console.log(result)
}
module_test()