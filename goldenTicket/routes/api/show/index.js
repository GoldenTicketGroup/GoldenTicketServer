const express = require('express');
const router = express.Router();

router.use('/schedule', require('./schedule'));
router.use('/', require('./show'));

module.exports = router;