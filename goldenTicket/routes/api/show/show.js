var express = require('express');
var router = express.Router();

//공연 리스트 조회
router.get('/', async(req, res) => {
    res.status(200).send("test");
});

//공연 상세 조회
router.get('/:id', async(req, res) => {
    res.status(200).send("test2");
});

//공연 등록
router.post('/', async(req, res) => {
    res.status(200).send("test");
});

//공연 수정
router.put('/', async(req, res) => {
    res.status(200).send("test");
});

//공연 삭제
router.delete('/', async(req, res) => {
    res.status(200).send("test");
});

module.exports = router;
