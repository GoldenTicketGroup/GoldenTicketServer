const express = require('express')
const router = express.Router()
const showModule = require('../../../models/show')
const artistModule = require('../../../models/artist')
const posterModule = require('../../../models/poster')
const likeModule = require('../../../models/like')
const authUtil = require("../../../modules/utils/security/authUtils")
const upload = require('../../../config/multer')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')
const showFilter = require('../../../modules/utils/filter/showFilter')
const scheduleFilter = require('../../../modules/utils/filter/scheduleFilter')
const db = require('../../../modules/utils/db/pool')

//홈 화면 공연 리스트 조회
router.get('/home', async(req, res) => {
    const selectHomeQuery = 'SELECT * FROM schedule LEFT JOIN `show` '
    + 'USING (showIdx) WHERE date = CURDATE() ORDER BY showIdx ASC'
    let result = await db.queryParam_None(selectHomeQuery);
    if(result.isError)
    { 
        res.status(200).send(result.jsonData)
    }
    else
    {
        result = showFilter.homeAllShowFilter(result.map(it => showFilter.homeAllShowInfo(it)))
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('공연'), result))
    }
})

//공연 상세 조회
router.get('/detail/:id', authUtil.isLoggedin, async(req, res) => {
    const userIdx = req.decoded.userIdx
    const showIdx = req.params.id
    const whereJson = {
        showIdx : parseInt(showIdx)
    }
    const showResult = await showModule.select(whereJson)
    const opts = {
        joinJson: {
            table: "`show`",
            foreignKey: `showIdx`,
            type: "LEFT"
        }
    }
    const selectScheduleQuery= "SELECT * FROM schedule LEFT JOIN `show` " +
    `USING (showIdx) WHERE showIdx = ${showIdx} AND date = CURDATE()`
    let scheduleResult = await db.queryParam_None(selectScheduleQuery)
    let result = showFilter.detailShowFilter(showResult)
    const artistResult = await artistModule.selectAll(whereJson, opts)
    const posterResult = await posterModule.selectAll(whereJson, opts)
    const showLikeQuery= "SELECT * FROM `like` " +
    `WHERE showIdx = ${showIdx} AND userIdx = ${userIdx}`
    let showLikeResult = await db.queryParam_None(showLikeQuery)
    if(showResult.isError || !scheduleResult || !showLikeResult || artistResult.isError || posterResult.isError || artistResult.length==0 || posterResult.length==0)
    {
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, responseMessage.FAIL_READ_X('공연')))
    }
    else
    {
        if(showLikeResult.length == 0)
        {
            result.is_liked = 0
        }
        else
        {
            result.is_liked = 1
        }
        scheduleResult = scheduleFilter.detailScheduleFilter(scheduleResult)
        result.schedule = scheduleResult
        result.artist = artistResult
        result.poster = posterResult
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('공연'), result))
    }
})

//관심있는 공연 리스트 조회
router.get('/heart', authUtil.isLoggedin, async(req, res) => {
    const userIdx = req.decoded.userIdx
    const whereJson = { 
        userIdx
    }
    const opts = {
        fields: `showIdx as show_idx, detailImage as image_url, name`,
        joinJson: {
            table: "`show`",
            foreignKey: `showIdx`,
            type: "LEFT"
        }
    }
    let result = await likeModule.getLikeList(whereJson, opts)
    if(result.isError && result.jsonData.status == 404)
    { 
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.NO_HEART, []))
        return
    }
    if(result.isError)
    { 
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, responseMessage.FAIL_READ_X_ALL('공연')))
    }
    else
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.SHOW_HEART, result))
    }
})

//공연 등록
router.post('/', upload.single('imageUrl'), async(req, res) => {
    if(!req.file)
    {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
    }
    else{
        const imageUrl = req.file.location
        const name = req.body.name
        const originalPrice = req.body.originalPrice
        const discountPrice = req.body.discountPrice
        const location = req.body.location
        const accountHolder = req.body.accountHolder
        const accountNumber = req.body.accountNumber
        const showInfo = {
            imageUrl,
            name,
            originalPrice,
            discountPrice,
            location,
            accountHolder,
            accountNumber
        }
        const result = await showModule.apply(showInfo)
        if(result)
            res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_X('공연')))
    }
})

//공연 삭제
router.delete('/:id', async(req, res) => {
    const showIdx = req.params.id
    const whereJson = {
        showIdx
    }
    const result = await showModule.remove(whereJson)
    if(!result.isError)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.REMOVED_X('공연')))
    }
    else
    {
        res.status(200).send(result.jsonData)
    }
})

module.exports = router
