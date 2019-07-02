const authUtil = require("../../../modules/utils/security/authUtils")
const express = require('express')
const router = express.Router()
const userModule = require('../../../models/user')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

// 유저 정보 변경하기
router.put('/', authUtil.isLoggedin , async (req, res) => {
    const name = req.body.name  
    const email = req.body.email
    const phone = req.body.phone
    const inputUser = { name, email, phone }
    const decoded = req.decoded
    const userCondition = { decoded }
    const updateUser = await userModule.update( inputUser, userCondition )
    if(!updateUser.isError)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.UPDATED_X('유저')))
    }
    else{
        res.status(200).send(updateUser)
    }
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