const express = require('express')
const router = express.Router()
const lotteryModule = require('../../../models/lottery')
const authUtil = require("../../../modules/utils/security/authUtils")

const WORD = '응모'

// 티켓 응모하기(등록)
router.post('/', async (req, res) => {
    const userIdx = req.body.userIdx
    const scheduleIdx = req.body.scheduleIdx
    const whereJson = {
        userIdx,
        scheduleIdx
    }
    const result = await lotteryModule.apply(whereJson)
    res.status(200).send(result.jsonData)
})

// 티켓 수정
router.put('/', async (req, res) => {
    res.status(200).send("lottery test2")
})

// 티켓 응모 상세 조회
router.get('/:id', async (req, res) => {
    const userIdx = req.params.id
    const whereJson = {
        userIdx
    }
    const result = await lotteryModule.select(whereJson)
    res.status(200).send(result.jsonData)
})

// 티켓 응모 리스트 조회
router.get('/', authUtil.isLoggedin, async (req, res) => {
    const decoded = req.decoded
    const whereJson = {
        userIdx : decoded.userIdx
    }
    const result = await lotteryModule.selectAll(whereJson)
    res.status(200).send(result.jsonData)
})

//티켓 응모 삭제
router.delete('/:id', async (req, res) => {
    const lotteryIdx = req.params.id
    const whereJson = {
        lotteryIdx
    }
    const result = await lotteryModule.delete(whereJson)
    res.status(200).send(result.jsonData)
})

// 당첨 티켓 추첨
// router.select('/:name', async (req, res) => {
//     res.status(200).send("lottery test6")
// })

module.exports = router
