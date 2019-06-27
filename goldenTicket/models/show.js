const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')

const WORD = '공연'

const convertShow = (showData) => {
    return {
        // 아래 내용은 그냥 임시
        show_idx: showData.showIdx,
        imageUrl: showData.imageUrl,
        backImg: showData.backImageUrl,
        name: showData.name,
        price: showData.price,
        location: showData.location,
        infoimgUrl: showData.infoimageUrl,
        accountHolder: showData.accountHolder,
        accountPrice: showData.accountPrice,
        likes: showData.likes,
        thumbnail: showData.thumbnail
    }
}

module.exports = {
    insert: async (jsonData) => {
        const result = await sqlManager.db_insert(db.queryParam_Parse, sqlManager.TABLE_SHOW, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        return result
    },
    select: async (whereJson) => {
        const result = await sqlManager.db_select(db.queryParam_Parse, sqlManager.TABLE_SHOW, whereJson)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_X(WORD)))
        }
        return convertShow(result[0])
    },
    selectAll: async (whereJson, opts) => {
        const result = await sqlManager.db_select(db.queryParam_Parse, sqlManager.TABLE_SHOW, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X_ALL(WORD)))
        }
        return result.map(it => convertShow(it))
    }
}