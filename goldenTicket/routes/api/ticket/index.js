const express = require('express');
const router = express.Router();
const lottery = require('./ticket.js');

router.use('/ticket', ticket);

module.exports = router;