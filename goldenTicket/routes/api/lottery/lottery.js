const express = require('express')
const router = express.Router()

// 티켓 응모하기
router.post('/', async (req, res) => {
    res.status(200).send("lottery test1")
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
