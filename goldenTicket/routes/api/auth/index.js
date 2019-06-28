const express = require('express')
const router = express.Router()

router.use('/signin', require('./signin'))
router.use('/signup', require('./signup'))

module.exports = router