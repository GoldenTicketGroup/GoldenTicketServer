const express = require('express');
const router = express.Router();

// 당첨 티켓 등록
router.post('/', async (req, res) => {
    res.status(200).send("test1")
});

// 당첨 티켓 수정
router.put('/', async (req, res) => {
    res.status(200).send("test2")
});

// 당첨 티켓 상세 조회
router.get('/:id', async (req, res) => {
    res.status(200).send("test3")
});

// 당첨 티켓 전체 조회
router.get('/', async (req, res) => {
    res.status(200).send("test4")
});

// 당첨 티켓 삭제 부분은 관리자가 직접 삭제
module.exports = router;