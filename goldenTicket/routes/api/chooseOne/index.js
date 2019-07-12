const express = require('express')
const router = express.Router();

router.use('/', require('./chooseOne'))

module.exports = router