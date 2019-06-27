const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')

const WORD = `해시 태그`

module.exports = {
    register: async (jsonData) => {
        const result = await sqlManager.db_insert(db.queryParam_Parse, sqlManager.TABLE_HASHTAG, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        return result
    },
    getTagList: async (whereJson) => {
        // const query = "SELECT keyword FROM comics.hashtag group by keyword"
        const opts = {
            fields: 'keyword',
            groupBy: 'keyword'
        }
        const result = await sqlManager.db_select(db.queryParam_Parse, sqlManager.TABLE_HASHTAG, whereJson, opts)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        return result.map(it => it.keyword)
    },
    getShowList: async (keyword) => {
        // const query = `SELECT comics.* FROM comics.hashtag LEFT JOIN comics ON hashtag.comicsIdx = comics.comicsIdx where keyword = '${keyword}' group by keyword;`
        const whereJson = {
            keyword: keyword
        }
        const opts = {
            fields: `${sqlManager.TABLE_SHOW}.*`,
            joinJson: {
                type: 'LEFT',
                foreignKey: 'comicsIdx',
                table: sqlManager.TABLE_SHOW
            },
            groupBy: 'keyword'
        }
        const result = await sqlManager.db_select(db.queryParam_Parse, sqlManager.TABLE_HASHTAG, whereJson, opts)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        return result
    }
}
const module_test = async () => { 
    // const query = `SELECT comics.* FROM comics.hashtag LEFT JOIN comics ON hashtag.comicsIdx = comics.comicsIdx where keyword = '${keyword}' group by keyword;`
    const whereJson = {
        keyword: 'keyword'
    }
    const opts = {
        fieldsJson: `${sqlManager.TABLE_SHOW}.*`,
        joinJson: {
            type: 'LEFT',
            foreignKey: 'showIdx',
            table: sqlManager.TABLE_SHOW
        },
        groupBy: 'keyword'
    }
    const result = await sqlManager.db_select((test) => test, sqlManager.TABLE_HASHTAG, whereJson, opts)
    if (!result) {
        return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
    }
    console.log(result)
}
module_test()