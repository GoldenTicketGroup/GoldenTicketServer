const express = require('express')
const router = express.Router()
const ticketModule = require('../../../models/ticket')

// 당첨 티켓 등록
router.post('/', async (req, res) => {
    const qrcode = req.body.qrcode
    const userIdx = req.body.userIdx
    const scheduleIdx = req.body.scheduleIdx
    const seatIdx = req.body.seatIdx
    const whereJson = {
        qrcode,
        userIdx,
        scheduleIdx,
        seatIdx
    }
    const result = await ticketModule.insert(whereJson)
    console.log(result)
    res.status(200).send(result.jsonData)
})

// 당첨 티켓 수정
router.put('/', async (req, res) => {
    res.status(200).send("test2")
})

// 당첨 티켓 상세 조회
router.get('/:id', async (req, res) => {
    res.status(200).send("test3")
})

// 당첨 티켓 전체 조회
router.get('/', async (req, res) => {
    res.status(200).send("test4")
})

// 당첨 티켓 삭제 부분은 관리자가 직접 삭제
module.exports = router