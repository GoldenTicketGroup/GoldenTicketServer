const express = require('express')
const router = express.Router()

router.use('/content', require('./showContent'))
router.use('/like', require('./like'))
router.use('/schedule', require('./schedule'))
router.use('/heart', require('./heart'))
router.use('/', require('./show'))

module.exports = router