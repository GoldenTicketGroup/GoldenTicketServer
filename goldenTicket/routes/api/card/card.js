const express = require('express')
const router = express.Router()

//카드 리스트 조회
router.get('/', async(req, res) => {
    res.status(200).send("card test")
})

//카드 상세 조회
router.get('/:id', async(req, res) => {
    res.status(200).send("card test2")
})

//카드 작성
router.post('/', async(req, res) => {
    res.status(200).send("card test3")
})

//카드 삭제
router.delete('/', async(req, res) => {
    res.status(200).send("card test4")
})
module.exports = router