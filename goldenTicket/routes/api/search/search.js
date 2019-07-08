const express = require('express')
const router = express.Router()
const hashTagModule = require('../../../models/hashtag')
const showModule = require('../../../models/show')


// 공연 검색
router.get('/:text', async (req, res) => {
    const text = req.params.text
    console.log(text)
    const whereJson = {
        name: {
            equ: 'LIKE',
            value: `%${text}%`
        },
    }
    const result = await showModule.getShowList(whereJson)
    console.log(result)
    res.status(200).send(result)
})

// 해시태그 공연 검색
router.get('/', async (req, res) => {
    const keyword = req.body.keyword
    const result = await hashTagModule.getTagList(keyword)
    console.log(result)
    res.status(200).send(result)
})

module.exports = router
