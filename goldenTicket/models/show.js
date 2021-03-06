const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const Utils = require('../modules/utils/rest/utils')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')
const WORD = '공연'
const TABLE_NAME = sqlManager.TABLE_SHOW

const showModule = {
    apply: async (jsonData, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        if (result.isError == true && typeof(result.jsonData) == 'string') {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, result.jsonData))
        }
        if (result.isError == true) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, result.jsonData(WORD)))
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
    lottery: async (whereJson, sqlFunc) => {
        const lotteryQuery = 'SELECT showIdx FROM schedule '+
        'INNER JOIN (SELECT lottery.scheduleIdx FROM lottery '+
        `WHERE lottery.userIdx = ${whereJson.userIdx}) showLottery `+
        'ON showLottery.scheduleIdx = schedule.scheduleIdx'
        const result = await db.queryParam_None(lotteryQuery)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        return result
    },
    getShowList: async (whereJson, opts, sqlFunc) => {  
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.NOT_FOUND, MSG.NO_X(WORD)))
        }
        return result
    },
    remove: async (whereJson, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_delete(func, TABLE_NAME, whereJson)
        if(result.affectedRows == 0)
        {
            return new errorMsg(true, Utils.successFalse(CODE.NOT_FOUND, MSG.NO_X(WORD)))
        }
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_REMOVED_X(WORD)))
        }
        return result
    },
    todayShowList: async(whereJson, sqlFunc)=>{
        const todayListQuery = 'SELECT showIdx AS show_idx, detailImage AS image_url FROM `show`'
        const result = await db.queryParam_None(todayListQuery)
        if(result.length == 0)
        {
            return new errorMsg(true, Utils.successFalse(CODE.NOT_FOUND, MSG.NO_SHOW_TODAY))
        }
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_REMOVED_X(WORD)))
        }
        return result
    }
}
module.exports = showModule

const apply_test = async () => {
    console.log('DB TEST [ Show : apply]')
    const dummy = {
        imageUrl: 'http://ticketimage.interpark.com/Play/image/large/17/17008577_p.gif',
        name: '밴허',
        originalPrice: '150,000',
        discountPrice: '20,000',
        location: '블르 스퀘어 인터파크홀',
        accountHolder: '윤희성',
        accountNumber: '국민 472501-04-042743'
    }
    const result = await showModule.apply(dummy)
    console.log(result)
}
const select_test = async () => {
    console.log('DB TEST [ Show : select]')
    const whereJson = {
        name: '밴허'
    }
    const result = await showModule.select(whereJson)
    console.log(result)
}
const getShowList_test = async () => {
    console.log('DB TEST [ Show : getShowList]')
    const whereJson = {name: '벤허' }
    const result = await showModule.getShowList(whereJson)
    console.log(result)   
}
const remove_test = async () => {
    console.log('DB TEST [ Show : remove]')
    const whereJson = {name: '밴허' }
    const result = await showModule.remove(whereJson)
    console.log(result)   
}
const module_test = async () => {
    //await apply_test()
    await select_test()
    // await getShowList_test()
    //await remove_test()
}
//  module_test()
