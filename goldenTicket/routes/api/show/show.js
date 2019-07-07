const express = require('express')
const router = express.Router()
const showModule = require('../../../models/show')
const scheduleModule = require('../../../models/schedule')
const artistModule = require('../../../models/artist')
const posterModule = require('../../../models/poster')
const upload = require('../../../config/multer')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')
const showFilter = require('../../../modules/utils/filter/showFilter')

//홈 화면 공연 리스트 조회
router.get('/home', async (req, res) => {
    const result = [{
            "show_idx": 20,
            "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/1562055837775.jpg",
            "name": "뮤지컬 벤허",
            "location": "혜화 소극장",
            "running_time": "14:00 ~ 16:00 / 16:00 ~ 18:00 ..."
        },
        {
            "show_idx": 21,
            "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/1562056070170.jpg",
            "name": "캣츠",
            "location": "아르코 예술극장",
            "running_time": "7:00 ~ 19:00"
        }
    ]
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X_ALL('공연'), result))
})

//상세 페이지 공연 상세 조회
router.get('/detail/:id', async (req, res) => {
    if(req.params.id == undefined){
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
    }
    const result = {
        "show_idx": 20,
        "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/poster_benhur_info.jpg",
        "name": "뮤지컬 벤허",
        "location": "혜화 소극장",
        "original_price": "100,000",
        "discount_price": "30,000",
        "draw_available": 0,
        "schedule": [{
                "schedule_idx": 20,
                "time": "오후 4:00"
            },
            {
                "schedule_idx": 20,
                "time": "오후 6:00"
            },
            {
                "schedule_idx": 20,
                "time": "오후 6:00"
            }
        ],
        "artist": [{
                "artist_idx": 1,
                "name": "카이",
                "role": "유다 벤허",
                "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/img_casting_01.jpg"
            },
            {
                "artist_idx": 2,
                "name": "문종원",
                "role": "메셀라",
                "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/img_casting_02.jpg"
            },
            {
                "artist_idx": 3,
                "name": "김지우",
                "role": "에스더",
                "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/img_casting_03.jpg"
            },
            {
                "artist_idx": 4,
                "name": "이병준",
                "role": "퀸터스",
                "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/img_casting_04.jpg"
            }
        ],
        "poster": [{
                "poster_idx": 1,
                "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/long_info_benhur_01.jpg"
            },
            {
                "poster_idx": 2,
                "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/long_info_benhur_02.jpg"
            },
            {
                "poster_idx": 3,
                "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/long_info_benhur_03.jpg"
            },
            {
                "poster_idx": 4,
                "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/long_info_benhur_04.jpg"
            }
        ]
    }
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('공연'), result))
})

module.exports = router
