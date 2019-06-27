const express = require('express')
const router = express.Router()

router.use('/show', require('./show/index'));
module.exports = router
