const express = require('express');
const router = express.Router();

router.use('/', require('./show'));

module.exports = router;