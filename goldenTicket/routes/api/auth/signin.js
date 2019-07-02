const express = require('express')
const router = express.Router()
const userModule = require('../../../models/user')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

//로그인
router.post('/', async(req, res) => {
    const email = req.body.email
    const password = req.body.password
    const inputUser = { email, password }
    signInResult = await userModule.signIn(inputUser)
    if(signInResult.isError) {
        res.status(200).send(utils.successFalse(signInResult.jsonData.status, signInResult.jsonData.message))
    }
    else {
        const accessToken = signInResult.token.accessToken
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_USER, { accessToken }))
    }
})

module.exports = router