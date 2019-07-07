const authUtil = require("../../../modules/utils/security/authUtils")
const express = require('express')
const router = express.Router()
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')


//공연 좋아요 등록
router.post('/', authUtil.isLoggedin , async(req, res) => {
    if(req.body.showIdx == undefined){
        res.status(200).send(utils.successTrue(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
        return
    }
    const result = 
    {
        "status": 200,
        "success": true,
        "message": "좋아요 성공"
    }
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.LIKE_X))

});

//공연 좋아요 삭제
router.delete('/', authUtil.isLoggedin , async(req, res) => {
    unlikeResult = 
    {
        "status": 200,
        "success": true,
        "message": "좋아요 취소"
    }
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.UNLIKE_X))
});

module.exports = router;
