const express = require('express');
const router = express.Router();
const lottery = require('./lottery.js');

router.use('/lottery', lottery);

module.exports = router;