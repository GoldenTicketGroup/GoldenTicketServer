const express = require('express')
const router = express.Router()
const lotteryModule = require('../../../models/lottery')
const upload = require('../../../config/multer')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')


// 티켓 응모하기(등록)
router.post('/', async (req, res) => {
    const userIdx = req.body.userIdx
    const scheduleIdx = req.body.scheduleIdx
    const lottery = {
        userIdx,
        scheduleIdx
    }
    const result = await lotteryModule.apply(lottery)
    res.status(200).send(result) 
})

// 티켓 수정
router.put('/', async (req, res) => {
    res.status(200).send("lottery test2")
})

// 티켓 응모 상세 조회
router.get('/:id', async (req, res) => {
    res.status(200).send("lottery test3")
})

// 티켓 응모 리스트 조회
router.get('/', async (req, res) => {
    res.status(200).send("lottery test4")
})

//티켓 응모 삭제
router.delete('/:id', async (req, res) => {
    res.status(200).send("lottery test5")
})

// 당첨 티켓 추첨
// router.select('/:name', async (req, res) => {
//     res.status(200).send("lottery test6")
// })

module.exports = router
