const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const Utils = require('../modules/utils/rest/utils')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')
const WORD = '당첨 티켓'

module.exports = {
    insert: async (jsonData, opts, sqlFunc) => {
        if (jsonData.userIdx == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.NULL_VALUE))
        }
        
        const func = sqlFunc || db.queryParam_Parse
        // const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData, opts)
        const testQuery = 'SELECT * FROM (SELECT userIdx, scheduleIdx '+ 
        `FROM lottery WHERE userIdx = ${jsonData.userIdx}) newTable `+
        'INNER JOIN seat ON newTable.scheduleIdx = seat.scheduleIdx'
        const result = await db.queryParam_None(testQuery)
        console.log('xxxx', result[0])
        const ticket = {
            userIdx: jsonData.userIdx,
            qrcode : jsonData.imageUrl,
            scheduleIdx : result[0].scheduleIdx,
            seatIdx : result[0].seatIdx
        }
        const ticketResult = await sqlManager.db_insert(func, 'ticket', ticket)
        console.log(ticketResult)
        console.log(result[0].userIdx, result[0].seatIdx, result[0].scheduleIdx)
        if (!ticketResult) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        if (ticketResult.isError == true) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.FAIL_DB_READ))
        }
        return ticketResult
    }
}