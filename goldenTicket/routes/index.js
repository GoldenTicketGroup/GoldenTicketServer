const express = require('express');
const router = express.Router();
const lottery = require('./api/lottery/index');
const ticket = require('./api/ticket/index');

router.use('/lottery', lottery);
router.use('/ticket', ticket);

module.exports = router;