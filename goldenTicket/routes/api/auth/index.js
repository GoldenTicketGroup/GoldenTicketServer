const express = require('express')
const router = express.Router()

router.use('/signin', require('./signin'))
router.use('/signup', require('./signup'))
router.use('/user', require('./user'))

module.exports = router