const express = require('express')
const router = express.Router()

router.use('/card', require('./card/index'))
router.use('/auth', require('./auth/index'))
router.use('/show', require('./show/index'))
router.use('/ticket', require('./ticket/index'))
router.use('/lottery', require('./lottery/index'))
router.use('/search', require('./search/index'))
router.use('/chooseOne', require('./chooseOne/index'))
module.exports = router
