const express = require('express')
const router = express.Router()

//로그인
router.post('/', async(req, res) => {
    res.status(200).send("test8")
})

module.exports = router