const express = require('express');
const router = express.Router();

//공연 좋아요 등록
router.post('/', async(req, res) => {
    res.status(200).send("test5");
});

//공연 좋아요 삭제
router.delete('/', async(req, res) => {
    res.status(200).send("test5");
});

module.exports = router;
