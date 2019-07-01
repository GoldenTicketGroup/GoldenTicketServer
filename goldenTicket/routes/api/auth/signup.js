const express = require('express')
const router = express.Router()
const userModule = require('../../../models/user')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')


//회원가입
router.post('/', async(req, res) => {
    const name = req.body.name  
    const email = req.body.email
    const phone = req.body.phone
    const password = req.body.password
    const confirm = req.body.confirm
    const inputUser = { name, email, phone, password, confirm }
    signupResult = await userModule.signUp(inputUser)
    if(signupResult.isError)
    {
        res.status(200).send(utils.successFalse(signupResult.jsonData.status, signupResult.jsonData.message))
    }
    else
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_USER))
    }
});

module.exports = router;