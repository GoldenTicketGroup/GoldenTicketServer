const express = require('express');
const router = express.Router();

//공연 리스트 조회
router.get('/', async(req, res) => {
    res.status(200).send("test1");
});

//공연 상세 조회
router.get('/:id', async(req, res) => {
    res.status(200).send("test2");
});

//공연 등록
router.post('/', async(req, res) => {
    res.status(200).send("test1");
});

//공연 수정
router.put('/', async(req, res) => {
    res.status(200).send("test1");
});

//공연 삭제
router.delete('/', async(req, res) => {
    res.status(200).send("test1");
});

module.exports = router;
