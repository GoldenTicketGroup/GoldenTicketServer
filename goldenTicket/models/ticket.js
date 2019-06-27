const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')

const WORD = '구매 티켓'

const convertTicket = (TicketData) => {
    return {
        // 아래 내용은 그냥 임시
        Ticket_idx: TicketData.TicketIdx,
        schedule_idx: TicketData.scheduleIdx,
        user_idx: TicketData.userIdx,
        seat: TicketData.seat,
        win: TicketData.win,
        created_time: TicketData.createdTime
    }
}
module.exports = {
    insert: async (jsonData) => {
        const result = await sqlManager.db_insert(db.queryParam_Parse, sqlManager.TABLE_TICKET, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        return result
    },
    update: async (setJson, whereJson) => {
        const result = await sqlManager.db_update(db.queryParam_Parse, sqlManager.TABLE_TICKET, setJson, whereJson)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_UPDATED_X(WORD)))
        }
        return result
    },
    select: async (whereJson) => {
        const result = await sqlManager.db_select(db.queryParam_Parse, sqlManager.TABLE_TICKET, whereJson)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_X(WORD)))
        }
        return convertTicket(result[0])
    },
    selectAll: async (whereJson, opts) => {
        const result = await sqlManager.db_select(db.queryParam_Parse, sqlManager.TABLE_TICKET, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        return result.map(it => convertTicket(it))
    }
}