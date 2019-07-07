const express = require('express')
const router = express.Router()
const cardModule = require('../../../models/card')
const upload = require('../../../config/multer')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

//카드 리스트 조회
router.get('/', async(req, res) => {
    const result = 
    [
        {
            "cardIdx": 1,
            "imageUrl": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/1562165435447.jpeg",
            "title": "7월 연휴, 공연장 나들이 어때요?",
            "category": "이번 달 공연"
        },
        {
            "cardIdx": 2,
            "imageUrl": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/1562284025522.jpeg",
            "title": "7월 연휴, 무더운 더위를 피할 뮤지컬 어때요?",
            "category": "이번 달 뮤지컬"
        }
    ]
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X_ALL('카드'), result))
})

//카드 상세 조회
router.get('/:id', async(req, res) => {
    if(req.params.id == undefined){
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
    }
    const result = 
    {
        "card_idx": 1,
        "imageUrl": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/1562165435447.jpeg",
        "content": "공휴일 많았던 가정의 달, 5월이 끝나간다고 아쉬워하지 마세요. 6월에도 현충일을 끼고 '징검다리 연휴'가 있으니까요. 짧은 연휴지만 알차게 보내고 싶다면 공연장 나들이는 어떨까요? 6월에 보기 좋은 6편의 공연을 소개합니다.",
        "title": "7월 연휴, 공연장 나들이 어때요?",
        "category": "이번 달 공연",
        "content": [
        {
            "title": "<안나 카레니나>",
            "subtitle": "볼거리가 많은 대극장 뮤지컬",
            "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/img_contents_first_01.jpg",
            "content": "지난 2018년 국내 첫선을 보였던 뮤지컬 <안나 카레니나>가 돌아왔습니다. 톨스토이의 동명 소설을 원작으로 한 러시아 뮤지컬인데요.\n사랑 없는 결혼생활을 이어나던 귀 부인 안나가 젊고 매력적인 장교 브론스키와 사랑에 빠지면서 일어나는 일을 그렸습니다. LED 스크린을 활용한 연출과 화려한 조명, 스케이트 장면을 비롯한 격정적인 안무 등, 기존 브로드웨이 뮤지컬과는 다른 러시아 뮤지컬만의  독특한 매력을 느껴보고 싶은분께 추천합니다.",
            "show_idx": 20
        },
        {
            "title": "<킬미 나우>",
            "subtitle": "깊이 있는 주제의",
            "image_url": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/img_contents_first_01.jpg",
            "content": "깊이 있는 주제와 묵직한 감동이 있는 연극을 찾는다면 <킬미 나우>는 어떨까요?\n선천적 지체장애를 가졌지만 독립을 꿈꾸는 17세 소년 ‘조이’와 자신의 삶을 포기한 채 아들에게 헌신하며 살아온 아버지 ‘제이크’의 삶을 그린 작품인데요, 장애인 인권, 존엄사, 가족애 등에 대해 깊이 있는 질문을 던집니다. 평소 ‘인간다운 삶이란 무엇인지’에 대해 고민했던 분이라면 뜻깊은 작품으로 남을 듯 합니다. 이번 2019년 공연엔 초연부터 참여해온 이석준, 윤나무를 비롯해 장현성, 서영주, 서정연, 양소민 등의 배우가 출연합니다.",
            "show_idx": 21
        }]
    }
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('카드'), result))
})

module.exports = router
