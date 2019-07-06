const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const Utils = require('../modules/utils/rest/utils')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')

const WORD = '당첨 티켓'
const TABLE_NAME = sqlManager.TABLE_TICKET

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
    insert: async (jsonData, opts, sqlFunc) => {
        if (jsonData.userIdx == undefined || jsonData.seatIdx == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.NULL_VALUE))
        }
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData, opts)
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
        //존재하지 않는 티켓 조회
        const condition = `SELECT * FROM ticket WHERE ticketIdx = ${whereJson.ticketIdx}`
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
                return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.NO_X('당첨 내역')))
            }
            return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.READ_X(WORD), convertTicket(result[0])))
        }
    },
    selectAll: async (whereJson, opts,sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        if (result == 0){
            return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.READ_X_ALL(WORD+"이 없습니다."), result.map(it => convertTicket(it))))
        }
        return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.READ_X_ALL(WORD), result.map(it => convertTicket(it))))
    }
}