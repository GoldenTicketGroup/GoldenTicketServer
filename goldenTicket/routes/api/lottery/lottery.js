const express = require('express')
const router = express.Router()
const authUtil = require("../../../modules/utils/security/authUtils")
const utils = require('../../../modules/utils/rest/utils')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')

// 티켓 응모하기(등록)
router.post('/', authUtil.isLoggedin, async (req, res) => {
    if(req.body.scheduleIdx == undefined){
        res.status(200).send(utils.successTrue(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
    }
    const result = 
    {
        "status": 200,
        "success": true,
        "message": "응모 작성 성공"
    }
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_X('응모')))
})

// 티켓 응모 리스트 조회
router.get('/', authUtil.isLoggedin, async (req, res) => {
    const result = 
    [
        {
            "lottery_idx": 58,
            "name": "옥탑방 고양이",
            "start_time": "2019/07/07 12:00:00 pm"
        },
        {
            "lottery_idx": 58,
            "name": "옥탑방 고양이",
            "start_time": "2019/07/07 12:00:00 pm"
        }
    ]
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X_ALL('응모'),result))
})

module.exports = router
