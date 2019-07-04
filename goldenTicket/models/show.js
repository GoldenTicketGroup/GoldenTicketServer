const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const Utils = require('../modules/utils/rest/utils')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')

const WORD = '공연'
const TABLE_NAME = sqlManager.TABLE_SHOW
const TABLE_NAME_SCHEDULE = sqlManager.TABLE_SCHEDULE


// const date = JSON.stringify(scheduleData.date).split('-').join('.').substring(1,11)
// const startTime = JSON.stringify(scheduleData.startTime).substring(1,6)
// const endTime = JSON.stringify(scheduleData.endTime).substring(1,6)
// const time = startTime.concat("~", endTime)

const homeShowInfo = (showData) => {
    time = showData.map((e) => e.startTime.substring(0,5).concat(" ~ ", e.endTime.substring(0,5)))
    return {
        show_idx: showData[0].showIdx,
        image_url: showData[0].imageUrl,
        name: showData[0].name,
        location: showData[0].location,
        running_time : time
    }
}

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
        opts.joinJson.table = TABLE_NAME
        const result = await sqlManager.db_select(func, TABLE_NAME_SCHEDULE, whereJson, opts)
        console.log(result)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_X(WORD)))
        }
        if(opts.content === 'home')
        {
            return homeShowInfo(result)
        }
    },
    getShowList: async (whereJson, opts, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        return result.map(it => convertShowInfo(it))
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
