const express = require('express')
const router = express.Router()
const upload = require('../../../config/multer')
const ticketModule = require('../../../models/ticket')
const authUtil = require("../../../modules/utils/security/authUtils")
const filter = require("../../../modules/utils/filter/ticketFilter")

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
router.get('/:id', authUtil.isLoggedin, async (req, res) => {
    const ticketIdx = req.params.id
    const decoded = req.decoded
    const whereJson = {
        userIdx : decoded.userIdx,
        ticketIdx : ticketIdx
    }
    const result = await ticketModule.select(whereJson)
    if(result.jsonData.message == "당첨 내역 상세 조회 성공")
    {
            filter.ticketFilter(result.jsonData.data)
    }
    res.status(200).send(result.jsonData)
})

// 당첨 티켓 전체 조회
router.get('/', authUtil.isLoggedin, async (req, res) => {
    const decoded = req.decoded
    const whereJson = {
        userIdx : decoded.userIdx
    }
    const result = await ticketModule.selectAll(whereJson)
    if(result.isError && result.jsonData.message == '당첨 티켓이 없습니다. 전체 조회 성공')
    {
        result.jsonData.data = []
        res.status(200).send(result.jsonData)
    }
    res.status(200).send(result.jsonData)
})

// 당첨 티켓 삭제 부분은 관리자가 직접 삭제

module.exports = router
