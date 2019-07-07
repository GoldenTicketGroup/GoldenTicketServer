const express = require('express');
const router = express.Router();
const scheduleModule = require('../../../models/schedule')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

module.exports = router
