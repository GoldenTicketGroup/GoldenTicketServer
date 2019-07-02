const authUtil = require("../../../modules/utils/security/authUtils")
const express = require('express')
const router = express.Router()
const likeModule = require('../../../models/like')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')


//공연 좋아요 등록
router.post('/', authUtil.isLoggedin , async(req, res) => {
    const showIdx = req.body.showIdx
    const userIdx = req.decoded.userIdx
    likeResult = await likeModule.like(showIdx, userIdx)
    if(!likeResult.isError)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_X('좋아요')))
    }
    else{
        res.status(200).send(likeResult.jsonData)
    }
});

//공연 좋아요 삭제
router.delete('/', async(req, res) => {
    res.status(200).send("test5");
});

module.exports = router;
