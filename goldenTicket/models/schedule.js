const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const Utils = require('../modules/utils/rest/utils')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')
const WORD = '공연 일정'
const TABLE_NAME = sqlManager.TABLE_SCHEDULE

const scheduleModule = {
    apply: async (jsonData, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        if (result.isError == true) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, result.jsonData))
        }
        return result
    },
    select: async (whereJson, opts, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_X(WORD)))
        }
        return result[0]
    },
    getList: async (whereJson, opts, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        return result
    },
    update: async (setJson, whereJson, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_update(func, TABLE_NAME, setJson, whereJson)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_UPDATED_X(WORD)))
        }
        if (result.affectedRows == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_X(WORD)))
        }
        return result
    },
    remove: async (whereJson, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_delete(func, TABLE_NAME, whereJson)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_REMOVED_X(WORD)))
        }
        if (result.affectedRows == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_X(WORD)))
        }
        return result
    }
}
module.exports = scheduleModule
// TEST CODE
const apply_test = async (sqlFunc) => {
    console.log('DB TEST [ Schedule : apply]')
    const jsonData = {
        date: '2021-06-29',
        startTime: '18:00',
        endTime: '20:00',
        showIdx: 20
    }
    const result = await scheduleModule.apply(jsonData, sqlFunc)
    console.log(result)
}

const select_test = async (sqlFunc) => {
    console.log('DB TEST [ Schedule : select]')
    const whereJson = {}
    const result = await scheduleModule.select(whereJson, sqlFunc)
    console.log(result)
}

const getList_test = async (sqlFunc) => {
    console.log('DB TEST [ Schedule : getList]')
    const whereJson = {}
    const result = await scheduleModule.getList(whereJson, sqlFunc)
    console.log(result)
}

const remove_test = async (sqlFunc) => {
    console.log('DB TEST [ Schedule : remove]')
    const whereJson = {
        date: '0000-00-00'
    }
    const result = await scheduleModule.remove(whereJson, sqlFunc)
    console.log(result)
}

const update_test = async (sqlFunc) => {
    console.log('DB TEST [ Schedule : remove]')
    const setJson = {
        seatCount: 4
    }
    const whereJson = {
        date: '2020-06-29'
    }
    const result = await scheduleModule.update(setJson, whereJson, sqlFunc)
    console.log(result)
}
const transaction_test = async () => {
    const insertTransaction = await db.Transaction(async (connection) => {
        const queryStreamFunc = (query, value) => {
            return connection.queryStream(query, value)
        }
        await apply_test(queryStreamFunc)
        await update_test(queryStreamFunc)
        await remove_test(queryStreamFunc)
        throw '에러 발생'
    })
    console.log(insertTransaction)
}
const module_test = async () => {
    // await apply_test()
    // await update_test()
    // await getList_test()
    // await select_test()
    // await remove_test()
    // await transaction_test()
}
module_test()
