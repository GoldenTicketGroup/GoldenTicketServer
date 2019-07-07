const express = require('express')
const router = express.Router()
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')
const authUtil = require("../../../modules/utils/security/authUtils")

//관심있는 공연 조회
router.get('/', authUtil.isLoggedin, async (req, res) => {
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
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X_ALL('관심있는 공연'), result))
})

module.exports = router
