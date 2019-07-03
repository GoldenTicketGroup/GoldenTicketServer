const MSG = require('../modules/utils/rest/responseMessage')
const CODE = require('../modules/utils/rest/statusCode')
const Utils = require('../modules/utils/rest/utils')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')
const encryptionManager = require('../modules/utils/security/encryptionManager')
const jwt = require('../modules/utils/security/jwt')

const WORD = '유저'
const TABLE_NAME = sqlManager.TABLE_USER

const convertUser = (userData) => {
    return {
        // 아래 내용은 그냥 임시
        user_idx: userData.userIdx,
        email: userData.email,
        name: userData.name
    }
}
const userModule = {
    select: async (whereJson, opts, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_X(WORD)))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_X(WORD)))
        }
        return convertUser(result[0])
    },
    signUp: async (jsonData, sqlFunc) => {
        const salt = await encryptionManager.makeRandomByte()
        if(!jsonData.password) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.NULL_VALUE))
        }
        if(!jsonData.confirm) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.NULL_VALUE))
        }
        const hashedPassword = await encryptionManager.encryption(jsonData.password, salt)
        const password = jsonData.password
        const confirm = jsonData.confirm
        const func = sqlFunc || db.queryParam_Parse
        delete jsonData.password
        delete jsonData.confirm
        jsonData.password = hashedPassword;
        jsonData.salt = salt;
        const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_X(WORD)))
        }
        if (result.isError == true && result.jsonData === MSG.NULL_VALUE) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, result.jsonData))
        }
        if(password != confirm) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.WRONG_PW))
        }
        if (result.isError == true && result.jsonData === MSG.ALREADY_X) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, result.jsonData(WORD)))
        }
        return result
    },
    update: async (setJson, whereJson, sqlFunc) => {
        if(!setJson.name){
            delete setJson.name
        }
        if(!setJson.email){
            delete setJson.email
        }
        if(!setJson.phone){ 
            delete setJson.phone
        }
        whereJson = { userIdx :  whereJson.decoded.userIdx }
        const func = sqlFunc || db.queryParam_Parse 
        const result = await sqlManager.db_update(func, TABLE_NAME, setJson, whereJson)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_UPDATED_USER))
        }
        if (result.isError == true && result.jsonData === MSG.NULL_VALUE) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, result.jsonData))
        }
        return result
    },
    signIn: async (jsonData, sqlFunc) => {
        if(!jsonData.email || !jsonData.password)
        {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.NULL_VALUE))
        }
        const password = jsonData.password
        delete jsonData.password
        const whereJson = jsonData
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, {})
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_USER))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.NOT_FOUND, MSG.NO_USER))
        }
        const hashedPassword = await encryptionManager.encryption(password, result[0].salt)
        if(result[0].password != hashedPassword)
        {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.MISS_MATCH_PW))
        }
        const User = {
            userIdx: result[0].userIdx,
            email: result[0].email,
        }
        const token = jwt.sign(User)
        result[0].token = token
        return result[0]
    },
    withdrawal: async (userIdx, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const whereJson = {userIdx: userIdx}
        const result = await sqlManager.db_delete(func, TABLE_NAME, whereJson)
        console.log(result)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_REMOVED_USER))
        }
        if (result.affectedRows == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_X(WORD)))
        }
        return result
    }
}
module.exports = userModule

const signUp_test = async () => {
    console.log('DB TEST [ USER : signUp]')
    const result = await userModule.signUp({
        name: '황재석',
        email: 'dajasin245@naver.com',
        phone: '010-9959-5668',
        salt: '1234'
    })
    console.log(result)
}
const signIn_test = async () => {
    console.log('DB TEST [ USER : signIn]')
    const result = await userModule.signIn({
        email: 'heesung6701@naver.com'
    })
    console.log(result)
}
const update_test = async () => {
    console.log('DB TEST [ USER : update]')
    const result = await userModule.update({
        name: '윤희성',
        refreshToken:'1234',
        fcmToken: 'test'
    },{userIdx: 10})
    console.log(result)
}
const withdrawal_test = async () => {
    console.log('DB TEST [ USER : withdrawal]')
    const result = await userModule.withdrawal(40)
    console.log(result)
}
const module_test = async () => {
    // await signUp_test()
    await withdrawal_test()
    // await signIn_test()
    // await update_test()
}
// module_test()
