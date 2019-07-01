const express = require('express');
const router = express.Router();

router.use('/', require('./ticket'));

module.exports = router;