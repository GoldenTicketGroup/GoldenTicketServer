const express = require('express')
const router = express.Router()
const userModule = require('../../../models/user')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

const encryptionManager = require('../../../modules/utils/security/encryptionManager')

//회원가입
router.post('/', async(req, res) => {
    const input_name = req.body.name  
    const input_email = req.body.email
    const input_phone = req.body.phone
    const input_password = req.body.password
    if (!input_name || 
        !input_email ||
        !input_phone || 
        !input_password) {       
        return new errorMsg(true, Utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
    }
    const result = await signUp(input_name, input_email, input_phone, input_password)
    if(result.isError) {
        res.status(200).send(result.jsonData)
        return
    }
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_USER))
})

const signUp = async (input_name, input_email, input_phone, input_password) => {
    const salt = await encryptionManager.makeRandomByte()
    const hashedPassword = await encryptionManager.encryption(input_password, salt)
    const jsonData = {
        name: input_name,
        email: input_email,
        phone: input_phone,
        password: hashedPassword,
        salt: salt
    }
    signupResult = await userModule.signUp(jsonData)
    if(signupResult.isError) {
        return signupResult
    }
    return signupResult
}

const signUp_test = async () => {
    const result = await signUp("윤희성", "heesung6701@naver.com", "010-2081-3818", "1234")
    console.log(result)
}
// signUp_test()
module.exports = router