const express = require('express')
const router = express.Router()

router.use('/auth', require('./auth/index'));
router.use('/show', require('./show/index'));

module.exports = router
