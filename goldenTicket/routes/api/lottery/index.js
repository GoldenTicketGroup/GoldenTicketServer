const express = require('express')
const router = express.Router();

router.use('/', require('./lottery'))

module.exports = router