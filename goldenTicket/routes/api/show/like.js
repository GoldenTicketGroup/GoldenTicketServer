const authUtil = require("../../../modules/utils/security/authUtils")
const express = require('express')
const router = express.Router()
const likeModule = require('../../../models/like')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')


//공연 좋아요 등록
router.post('/', authUtil.isLoggedin , async(req, res) => {
    const showIdx = req.body.show_idx
    const userIdx = req.decoded.userIdx
    likeResult = await likeModule.like(showIdx, userIdx)
    if(!likeResult.isError)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.LIKE_X))
    }
    else{
        res.status(200).send(likeResult.jsonData)
    }
});

//공연 좋아요 삭제
router.delete('/', authUtil.isLoggedin , async(req, res) => {
    const showIdx = req.body.show_idx
    const userIdx = req.decoded.userIdx
    unlikeResult = await likeModule.unlike(showIdx, userIdx)
    if(!unlikeResult.isError)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.UNLIKE_X))
    }
    else{
        res.status(200).send(unlikeResult.jsonData)
    }
});

module.exports = router;
