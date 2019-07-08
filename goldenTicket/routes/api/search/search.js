const express = require('express')
const router = express.Router()
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')
const hashTagModule = require('../../../models/hashtag')
const showModule = require('../../../models/show')
const searchFilter = require('../../../modules/utils/filter/searchFilter')

// 공연 검색
router.post('/text', async (req, res) => {
    const text = req.body.text
    if(!text || text.length == 0)
    {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
    }
    const whereJson = {
        name: {
            equ: 'LIKE',
            value: `%${text}%`
        },
    }
    const opts = {
        fields: `showIdx, imageUrl, name`
    }
    let result = await showModule.getShowList(whereJson, opts)
    if(result.isError && result.jsonData.status == 404)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.NO_SEARCH, []))
        return
    }
    if(result.isError)
    {
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, responseMessage.FAIL_READ_X_ALL('공연')))
        return
    }
    result = searchFilter.textSearchFilter(result)
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('일반 검색'), result))
})

// 해시태그 공연 검색
router.post('/', async (req, res) => {
    const keyword = req.body.keyword
    const result = await hashTagModule.getTagList(keyword)
    console.log(result)
    res.status(200).send(result)
})

module.exports = router
