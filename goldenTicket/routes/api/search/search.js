const express = require('express')
const router = express.Router()
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')
const hashTagModule = require('../../../models/hashtag')
const showModule = require('../../../models/show')
const filter = require('../../../modules/utils/filter/searchFilter')
const authUtil = require("../../../modules/utils/security/authUtils")
const db = require('../../../modules/utils/db/pool')

// 공연 검색
router.post('/text', authUtil.isLoggedin, async (req, res) => {
    const text = req.body.text
    const userIdx = req.decoded.userIdx
    if(!text || text.length == 0)
    {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
        return
    }
    const whereJson = {
        name: {
            equ: 'LIKE',
            value: `%${text}%`
        },
    }
    const opts = {
        fields: `showIdx, detailImage, name`
    }
    let result = await showModule.getShowList(whereJson, opts)
    if(result.isError && result.jsonData.status == 404)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.NO_SEARCH, []))
        return
    }
    if(result.isError)
    {
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, responseMessage.FAIL_READ_X_ALL('공연')))
        return
    }
    result = filter.searchFilter(result, result, userIdx)
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('일반 검색'), result))
})

// 해시태그 공연 검색
router.post('/', authUtil.isLoggedin, async (req, res) => {
    const keyword = req.body.keyword
    const userIdx = req.decoded.userIdx
    if(!keyword || keyword.length == 0)
    {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
        return
    }
    let result = await hashTagModule.getTagList(keyword)
    let likeList = []
    for(let i=0; i<result.length ;i++)
    {
        const showLikeQuery= "SELECT * FROM `like` " +
        `WHERE showIdx = ${result[i].showIdx} AND userIdx = ${userIdx}`
        const showLikeResult = await db.queryParam_None(showLikeQuery)
        if(!showLikeResult)
        {
            res.status(200).send(utils.successFalse(statusCode.DB_ERROR, responseMessage.FAIL_READ_X('해시 태그')))
        }
        likeList.push(showLikeResult)        
    }
    if(result.isError)
    {
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, responseMessage.FAIL_READ_X('해시 태그')))
        return
    }
    if(result.length == 0)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.NO_HASH_TAG, []))
        return
    }
    result = filter.searchFilter(result, likeList)
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.HASH_TAG_SEARCH, result))
})

module.exports = router
