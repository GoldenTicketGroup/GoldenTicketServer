const express = require('express');
const router = express.Router();

// 당첨 티켓 관련
router.post('/', async (req, res) => {
    res.status(200).send("test1")
});

module.exports = router;