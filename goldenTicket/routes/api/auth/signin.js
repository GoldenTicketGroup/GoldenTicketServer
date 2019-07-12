const express = require('express')
const router = express.Router()
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')
const userModule = require('../../../models/user')

//로그인
router.post('/', async(req, res) => {
    const input_email = req.body.email
    const input_password = req.body.password
    const fcm_token = req.body.fcm_token
    if (!input_email || !input_password)
    {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
        return
    }
    const result = await userModule.signIn(input_email, input_password)
    if (result.isError) {
        res.status(200).send(result.jsonData)
    }
    if(fcm_token)
    {
        const updateResult = await userModule.update({fcmToken: fcm_token}, {email:input_email})
        console.log(updateResult)
    }
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_USER, result))
})
module.exports = router