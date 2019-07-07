const express = require('express')
const router = express.Router()

const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

//일반 검색
router.get('/', async (req, res) => {
    const result = [{
            "show_idx": 20,
            "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/poster_benhur_info.jpg",
            "name": "뮤지컬 벤허"
        },
        {
            "show_idx": 21,
            "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/poster_benhur_info.jpg",
            "name": "위키드"
        },
    ]
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('일반 검색'), result))

})
//공연 해시태그 검색
router.post('/', async (req, res) => {
    const result = [{
            "show_idx": 20,
            "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/poster_benhur_info.jpg",
            "name": "뮤지컬 벤허"
        },
        {
            "show_idx": 21,
            "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/poster_benhur_info.jpg",
            "name": "위키드"
        },
    ]
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('해시태그 검색'), result))
})

module.exports = router