const express = require('express')
const router = express.Router()

// 티켓 응모하기
router.post('/', async (req, res) => {
    res.status(200).send("lottery test1")
})

module.exports = router