const express = require('express');
const router = express.Router();

//회원가입
router.post('/', async(req, res) => {
    res.status(200).send("test9");
});

module.exports = router;