const express = require('express')
const router = express.Router()
const showContentModule = require('../../../models/showContent')
const upload = require('../../../config/multer')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

//콘텐츠 작성
router.post('/', upload.single('imageUrl'), async(req, res) => {
    if(!req.file)
    {
        console.log('너냐1')
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
    }
    else{
        const imageUrl = req.file.location
        const title = req.body.title
        const subtitle = req.body.subtitle
        const content = req.body.content
        const showIdx = req.body.showIdx
        const showContentInfo = {
            imageUrl, title, subtitle, content, showIdx
        }
        const result = await showContentModule.insert(showContentInfo)
        console.log(result)
        if(!result.isError)
        {
            res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_X('공연 컨텐츠')))
        }
        else
        {
            res.status(200).send(result.jsonData)
        }
    }
})

//콘텐츠 삭제
router.delete('/', async(req, res) => {
    res.status(200).send("test6")
})
module.exports = router