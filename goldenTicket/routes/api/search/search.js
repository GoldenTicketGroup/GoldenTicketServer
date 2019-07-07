const express = require('express')
const router = express.Router()
const showModule = require('../../../models/show')
const authUtil = require("../../../modules/utils/security/authUtils")
const qs = require('querystring')

// 공연 검색
router.get('/:text', async (req, res) => {
    const keyword = req.body.keyword
    const whereJson = {
        name: {
            equ: 'LIKE',
            value: `%${keyword}%`
        },
    }
    const result = await showModule.getShowList(whereJson)
    console.log(result)
    res.status(200).send(result)
})

module.exports = router
