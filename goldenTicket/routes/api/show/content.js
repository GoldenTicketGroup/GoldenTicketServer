const express = require('express')
const router = express.Router()

//콘텐츠 리스트 조회
router.get('/', async(req, res) => {
    res.status(200).send("test6")
})

//콘텐츠 상세 조회
router.get('/:id', async(req, res) => {
    res.status(200).send("test7")
})

//콘텐츠 등록
router.post('/', async(req, res) => {
    res.status(200).send("test6")
})

//콘텐츠 수정
router.put('/', async(req, res) => {
    res.status(200).send("test6")
})

//콘텐츠 삭제
router.delete('/', async(req, res) => {
    res.status(200).send("test6")
})

module.exports = router
