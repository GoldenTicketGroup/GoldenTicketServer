const express = require('express')
const router = express.Router()

// const scheduler = require('../modules/utils/scheduler/scheduler')
// scheduler.startCron()

router.use('/', require('./api'))
router.use('/test', require('./test'))

module.exports = router