const express = require('express')
const router = express.Router()

router.use('/card', require('./card'))
router.use('/auth', require('./auth'))
router.use('/show', require('./show'))
router.use('/ticket', require('./ticket'))
router.use('/lottery', require('./lottery'))
router.use('/search', require('./search'))

module.exports = router
