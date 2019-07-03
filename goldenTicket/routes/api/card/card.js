const express = require('express')
const router = express.Router()
const cardModule = require('../../../models/card')
const upload = require('../../../config/multer')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')


//카드 리스트 조회
router.get('/', async(req, res) => {
    res.status(200).send("card test")
})

//카드 상세 조회
router.get('/:id', async(req, res) => {
    res.status(200).send("card test2")
})

//카드 작성
router.post('/', upload.single('imageUrl'), async(req, res) => {
    if(!req.file)
    {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
    }
    else{
        const imageUrl = req.file.location
        const content = req.body.content
        const title = req.body.title
        const category = req.body.category
        const cardInfo = {
            imageUrl, content, title, category
        }
        const result = await cardModule.insert(cardInfo)
        console.log(result)
        if(!result.isError)
        {
            res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_X('카드')))
        }
        else
        {
            res.status(200).send(result.jsonData)
        }
    }
})

//카드 삭제
router.delete('/', async(req, res) => {
    res.status(200).send("card test4")
})
module.exports = router