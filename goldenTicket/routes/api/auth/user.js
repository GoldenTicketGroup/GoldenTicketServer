const authUtil = require("../../../modules/utils/security/authUtils")
const express = require('express')
const router = express.Router()
const userModule = require('../../../models/user')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

// 유저 정보 변경하기
router.put('/', authUtil.isLoggedin , async (req, res) => {
    const input_name = req.body.name  
    const input_email = req.body.email
    const input_phone = req.body.phone
    const input_password = req.body.password
    if(!input_name && !input_email && !input_phone) {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.NULL_VALUE))
    }
    if(input_password == undefined) {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.NULL_PASSWORD))
    }
    const userIdx = req.decoded.userIdx
    const updateResult = await userModule.edit(input_name, input_email, input_phone, input_password, userIdx)
    if(updateResult.isError)
    {
        res.status(200).send(updateResult.jsonData)
        return
    }
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.UPDATED_X('유저')))
})

// 유저 삭제하기
router.delete('/', authUtil.isLoggedin , async (req, res) => {
    const decoded = req.decoded
    console.log(decoded.userIdx)
    const deleteUser = await userModule.withdrawal( decoded.userIdx )
    if(!deleteUser.isError)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.REMOVED_USER))
    }
    else {
        res.status(200).send(deleteUser.jsonData)
    }
})

module.exports = router