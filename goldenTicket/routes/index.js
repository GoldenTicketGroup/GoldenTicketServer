const express = require('express')
const router = express.Router()

const scheduler = require('../modules/utils/scheduler/scheduler')
scheduler.startCron()

router.use('/', require('./api'))

module.exports = router