const express = require('express')
const router = express.Router()

router.use('/cron-test', require('./cron-test'))

module.exports = router