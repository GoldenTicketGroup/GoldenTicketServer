const express = require('express')
const router = express.Router()

router.use('/', require('./search'))

module.exports = router