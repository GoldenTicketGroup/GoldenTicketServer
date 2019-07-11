const express = require('express')
const router = express.Router()
const upload = require('../../../config/multer')
const ticketModule = require('../../../models/ticket')
const authUtil = require("../../../modules/utils/security/authUtils")
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const filter = require("../../../modules/utils/filter/ticketFilter")
const utils = require('../../../modules/utils/rest/utils')

// 후순위
// 당첨 티켓 등록
// 당첨 후 이미 관람 한 내역은 있을 수 있음
router.post('/', upload.single('imageUrl'), authUtil.isLoggedin, async (req, res) => {
    const imageUrl = req.file.location
    const decoded = req.decoded
    const scheduleIdx = req.body.scheduleIdx
    const seatIdx = req.body.seatIdx
    const whereJson = {
        imageUrl,
        userIdx : decoded.userIdx,
        scheduleIdx,
        seatIdx
    }
    const result = await ticketModule.insert(whereJson)
    res.status(200).send(result.jsonData)
})

// 당첨 티켓 수정
router.put('/', async (req, res) => {
    res.status(200).send("test2")
})

// 당첨 티켓 상세 조회
router.get('/detail', authUtil.isLoggedin, async (req, res) => {
    const decoded = req.decoded
    const whereJson = {
        userIdx : decoded.userIdx
    }
    const result = await ticketModule.select(whereJson)
    if(result.isError){
        res.status(200).send(result.jsonData)
    }
    if(result.length == 0){ //당첨 안 됐을 때
        //console.log('당첨 안됐을 때22')
        res.status(200).send(utils.successTrue(statusCode.NO_CONTENT, responseMessage.OK_NO_X('당첨'), result[0]))
    }
    //console.log('당첨 됐을 때2222')
    //console.log(result.is_paid)
    if(result.is_paid == 0){ //당첨됐지만 결제를 하지 않은 상태
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('당첨 내역(미결제)'), filter.ticketFilter(result)))
    } else if(result.is_paid == 1){ //당첨됐지만 결제 완료한 상태
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('당첨 내역(결제완료)'), filter.ticketFilter(result)))
    }
})

// 당첨 티켓 전체 조회
router.get('/', authUtil.isLoggedin, async (req, res) => {
    const decoded = req.decoded
    const whereJson = {
        userIdx : decoded.userIdx
    }
    const result = await ticketModule.selectAll(whereJson)
    if(result.isError){
        res.status(200).send(result.jsonData)
    }
    if(result.length == 0) {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.OK_NO_X('당첨 티켓'), result))
    }
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X_ALL('당첨 티켓'), filter.ticketFilter(result[0])))
})

// 당첨 티켓 삭제 부분은 관리자가 직접 삭제

module.exports = router
