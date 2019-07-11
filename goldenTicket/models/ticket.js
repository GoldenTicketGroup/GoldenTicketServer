const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const Utils = require('../modules/utils/rest/utils')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')
const WORD = '당첨 티켓'
const TABLE_NAME = sqlManager.TABLE_TICKET

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
    select: async (whereJson) => {
        const selectDetailQuery = 'SELECT newTicket.startTime, newTicket.endTime, newTicket.isPaid AS is_paid, newTicket.ticketIdx AS ticket_idx, qrcode AS qr_code, newTicket.roundedImage AS image_url, newTicket.date, name, seatType AS seat_type, seatName AS seat_name, discountPrice AS price, location ' +
        'FROM (SELECT ticket.ticketIdx, show.showIdx, ticket.qrcode, ticket.isPaid, show.roundedImage, schedule.date, show.name, seat.seatType, seat.seatName, show.discountPrice, show.location, schedule.startTime, schedule.endTime ' +
        'FROM ((( `show` INNER JOIN schedule ' +
        'ON show.showIdx = schedule.showIdx) ' +
        'INNER JOIN seat ON schedule.scheduleIdx = seat.scheduleIdx) ' +
        'INNER JOIN ticket ON seat.seatIdx = ticket.seatIdx) ' +
        `WHERE ticket.userIdx = ${whereJson.userIdx}) newTicket `+
        `WHERE newTicket.ticketIdx = ${whereJson.ticketIdx}`
        const result = await db.queryParam_None(selectDetailQuery)
        //존재하지 않는 티켓 조회
        const condition = `SELECT * FROM ticket WHERE ticketIdx = ${whereJson.ticketIdx}`
        const result2 = await db.queryParam_None(condition)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        if (result2.length == 0) { //존재하지 않는 티켓을 조회했을 때
            if (result.length == 0) {
                return new errorMsg(true, Utils.successFalse(CODE.BAD_RE, MSG.NO_X(WORD)))
            }
        }
        if(result.length == 0){ //당첨되지 않았을 때
            //당첨 되지 않은 경우만 result로 반환하는 이유
            //이 경우가 에러가 아니기 때문에
            //ticket api에서 result.length하면 당첨되지 않은 경우만 undefined가 아니라서
            //경우를 나누어서 메시지 처리하기 편해서 이렇게 해줌...
            return result
        }
        //당첨 됐을 때
        return result[0]
    },
    selectAll: async (whereJson) => {
        const selectAllQuery = 'SELECT ticket.ticketIdx AS ticket_idx, qrcode AS qr_code, show.detailImage AS image_url, schedule.date, schedule.startTime, schedule.endTime, name, seatType AS seat_type, seatName AS seat_name, discountPrice AS price, location' +
        ' FROM ((( `show` INNER JOIN schedule ' +
        'ON show.showIdx = schedule.showIdx) INNER JOIN seat ' +
        'ON schedule.scheduleIdx = seat.scheduleIdx) ' +
        'INNER JOIN ticket ON seat.seatIdx = ticket.seatIdx) ' +
        `WHERE ticket.userIdx = ${whereJson.userIdx}`
        const result = await db.queryParam_None(selectAllQuery)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        if (result == 0){
            return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.READ_X_ALL(WORD+"이 없습니다.")))
        }
        let resultArray = []
        for(var i=0; i<result.length; i++)
        {
            resultArray.push(result[i])
        }
        return new errorMsg(true, Utils.successTrue(CODE.OK, MSG.READ_X_ALL('당첨 티켓'), resultArray))
    }
}