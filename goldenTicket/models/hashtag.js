const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')
const Utils = require('../modules/utils/rest/utils')
const WORD = `해시 태그`
const TABLE_NAME =  sqlManager.TABLE_HASHTAG

const hashtagModule = {
    register: async (jsonData, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        return result
    },
    getTagList: async (text) => {
        const selectHashTagQuery = 'SELECT * ' +
        'FROM show_hashTag, `show`, hashTag' +
        ` where hashTag.keyword LIKE '%${text}%' AND hashTag.hashTagIdx =  show_hashTag.hashTagIdx`
        + ` AND show_hashTag.showIdx = show.showIdx`
        const result = await db.queryParam_None(selectHashTagQuery);
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        return result
    },
    getShowList: async (keyword, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const whereJson = {
            keyword: keyword
        }
        const opts = {
            fields: `${sqlManager.TABLE_SHOW}.*`,
            joinJson: {
                type: 'LEFT',
                foreignKey: 'showIdx',
                table: sqlManager.TABLE_SHOW
            },
            groupBy: 'keyword'
        }
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        return result
    }
}
module.exports = hashtagModule

const module_test = async () => { 
    let result
    console.log('HASHTAG : register Test')
    result = await hashtagModule.register({name: '희성', content: '내용'})
    console.log(result)

    console.log('HASHTAG : getShowList Test')
    result = await hashtagModule.getShowList('일상')
    console.log(result)

    console.log('HASHTAG : getTagList Test')
    result = await hashtagModule.getTagList({})
    console.log(result)
}
// module_test()