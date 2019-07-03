const express = require('express')
const router = express.Router();

router.use('/', require('./card'))

module.exports = router