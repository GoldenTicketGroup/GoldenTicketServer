const express = require('express')
const router = express.Router()
const userModule = require('../../../models/user')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

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
            res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
    }
    const result = await userModule.signUp(input_name, input_email, input_phone, input_password)
    console.log(result)
    if(result.message == '존재하는 phone 입니다.')
    {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.ALREADY_PHONE))
        return
    }
    if(result.message == '존재하는 email 입니다.')
    {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.ALREADY_EMAIL))
        return
    }
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_USER))
})
module.exports = router 