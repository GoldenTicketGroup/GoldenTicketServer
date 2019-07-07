const authUtil = require("../../../modules/utils/security/authUtils")
const express = require('express')
const router = express.Router()
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

// 당첨 티켓 리스트 조회
router.get('/', authUtil.isLoggedin, async (req, res) => {
    const result = 
    [
        {
            "ticket_idx": 16,
            "qr_code":"https://raw.githubusercontent.com/zpao/qrcode.react/HEAD/qrcode.png",
            "image_url":"https://file.mk.co.kr/meet/neds/2019/04/image_readtop_2019_222216_15549409753706252.jpg",
            "date":"2019년 06월 15일",
            "name":"뮤지컬 벤허",
            "seatName":"일반 R석",
            "price":"20,000원",
            "location":"블르스퀘어 인터파크홀",
            "running_time":"17:00 ~ 19:00"
        },
        {
            "ticket_idx": 17,
            "qr_code":"https://raw.githubusercontent.com/zpao/qrcode.react/HEAD/qrcode.png",
            "image_url":"https://file.mk.co.kr/meet/neds/2019/04/image_readtop_2019_222216_15549409753706252.jpg",
            "date":"2019년 06월 15일",
            "name":"뮤지컬 벤허",
            "seatName":"일반 R석",
            "price":"20,000원",
            "location":"블르스퀘어 인터파크홀",
            "running_time":"17:00 ~ 19:00"
        },
        {
            "ticket_idx": 18,
            "qr_code":"https://raw.githubusercontent.com/zpao/qrcode.react/HEAD/qrcode.png",
            "image_url":"https://file.mk.co.kr/meet/neds/2019/04/image_readtop_2019_222216_15549409753706252.jpg",
            "date":"2019년 06월 15일",
            "name":"뮤지컬 벤허",
            "seatName":"일반 R석",
            "price":"20,000원",
            "location":"블르스퀘어 인터파크홀",
            "running_time":"17:00 ~ 19:00"
        }
    ]
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X_ALL('당첨 티켓'), result))
})

// 당첨 티켓 상세 조회
router.get('/:id', authUtil.isLoggedin, async (req, res) => {
    const result = 
    {
        "ticket_idx": 16,
        "qr_code":"https://raw.githubusercontent.com/zpao/qrcode.react/HEAD/qrcode.png",
        "image_url":"https://file.mk.co.kr/meet/neds/2019/04/image_readtop_2019_222216_15549409753706252.jpg",
        "date":"2019년 06월 15일",
        "name":"뮤지컬 벤허",
        "seatType":"일반 R석",
        "seatName":"객석 1층 15열 6번",
        "price":"20,000원",
        "location":"블르스퀘어 인터파크홀",
        "running_time":"17:00 ~ 19:00"
    }
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('당첨 티켓'), result))
})

// 당첨 티켓 삭제,등록 부분은 관리자가 직접 삭제

module.exports = router
