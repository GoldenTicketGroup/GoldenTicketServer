const responseMessage = require('../modules/utils/rest/responseMessage')
const statusCode = require('../modules/utils/rest/statusCode')
const utils = require('../modules/utils/rest/utils')
const errorMsg = require('../modules/utils/common/errorUtils')
const db = require('../modules/utils/db/pool')
const sqlManager = require('../modules/utils/db/sqlManager')
const encryptionManager = require('../modules/utils/security/encryptionManager')
const jwt = require('../modules/utils/security/jwt')

const WORD = '유저'
const TABLE_NAME = sqlManager.TABLE_USER

const userModule = {
    select: async (whereJson, opts, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_select(func, TABLE_NAME, whereJson, opts)
        if (result.length == undefined) {
            return new errorMsg(true, utils.successFalse(statusCode.DB_ERROR, responseMessage.FAIL_READ_X(WORD)))
        }
        if (result.length == 0) {
            return new errorMsg(true, utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NO_X(WORD)))
        }
        return result[0]
    },
    insert: async (jsonData, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_insert(func, TABLE_NAME, jsonData)
        if (!result) {
            return new errorMsg(true, utils.successFalse(statusCode.DB_ERROR, responseMessage.FAIL_CREATED_USER))
        }
        if (result.isError) {
            return result
        }
        return result
    },
    update: async (setJson, whereJson, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const result = await sqlManager.db_update(func, TABLE_NAME, setJson, whereJson)
        if (!result) {
            return new errorMsg(true, utils.successFalse(statusCode.DB_ERROR, responseMessage.FAIL_UPDATED_USER))
        }
        if (result.isError == true) {
            return result
        }
        return result
    },
    withdrawal: async (userIdx, sqlFunc) => {
        const func = sqlFunc || db.queryParam_Parse
        const whereJson = {
            userIdx: userIdx
        }
        const result = await sqlManager.db_delete(func, TABLE_NAME, whereJson)
        console.log(result)
        if (!result) {
            return new errorMsg(true, utils.successFalse(statusCode.DB_ERROR, responseMessage.FAIL_REMOVED_USER))
        }
        if (result.affectedRows == 0) {
            return new errorMsg(true, utils.successFalse(statusCode.DB_ERROR, responseMessage.NO_X(WORD)))
        }
        return result
    },
    signIn : async (input_email, input_password) => {
        const userResult = await userModule.select({email: input_email}, {})
        if (userResult.isError) {
            return userResult
        }
        const salt = userResult.salt
        const hashedPassword = await encryptionManager.encryption(input_password, salt)
        if(userResult.password != hashedPassword)
        {            
            return new errorMsg(true, utils.successFalse(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW))
        }
        const User = {
            userIdx: userResult.userIdx,
            email: userResult.email
        }
        const token = jwt.sign(User).accessToken
        const responseJson = {
            user_idx: userResult.userIdx,
            email: userResult.email,
            name: userResult.name,
            phone: userResult.phone,
            token: token
        }
        return responseJson
    },
    signUp: async (input_name, input_email, input_phone, input_password) => {
        const salt = await encryptionManager.makeRandomByte()
        const hashedPassword = await encryptionManager.encryption(input_password, salt)
        const jsonData = {
            name: input_name,
            email: input_email,
            phone: input_phone,
            password: hashedPassword,
            salt: salt
        }
        signupResult = await userModule.insert(jsonData)
        if (signupResult.isError) {
            return signupResult.jsonData
        }
        return signupResult
    },
    edit: async (input_name, input_email, input_phone, userIdx) => {    
        const setJson = {}
        if(input_name) setJson.name = input_name
        if(input_email) setJson.email = input_email
        if(input_phone) setJson.phone = input_phone

        const userResult = await userModule.select({userIdx: userIdx}, {})
        if(userResult.isError){
            return userResult
        }
        const salt = userResult.salt
        const updateResult = await userModule.update(setJson, {userIdx: userIdx})
        if(!updateResult){
            return new errorMsg(true, utils.successFalse(statusCode.DB_ERROR, responseMessage.FAIL_UPDATED_USER))
        }
        if(updateResult.isError){
            return updateResult
        }
        if(updateResult.affectedRows == 0) {
            return new errorMsg(true, utils.successTrue(statusCode.OK, responseMessage.NO_UPDATED))
        }
        return true
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
        refreshToken: '1234',
        fcmToken: 'test'
    }, {
        userIdx: 10
    })
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
