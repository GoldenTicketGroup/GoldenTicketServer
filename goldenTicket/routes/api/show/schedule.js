const express = require('express');
const router = express.Router();

//스케쥴 리스트 조회
router.get('/', async(req, res) => {
    res.status(200).send("test3");
});

//스케쥴 상세 조회
router.get('/:id', async(req, res) => {
    res.status(200).send("test4");
});

//스케쥴 등록
router.post('/', async(req, res) => {
    res.status(200).send("test3");
});

//스케쥴 수정
router.put('/', async(req, res) => {
    res.status(200).send("test3");
});

//스케쥴 삭제
router.delete('/', async(req, res) => {
    res.status(200).send("test3");
});

module.exports = router;
