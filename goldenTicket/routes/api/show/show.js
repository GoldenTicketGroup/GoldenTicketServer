const express = require('express')
const router = express.Router()
const showModule = require('../../../models/show')
const upload = require('../../../config/multer')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

//공연 상세 조회
router.get('/home/:id', async(req, res) => {
    const showIdx = req.params.id
    const whereJson = {
        showIdx : parseInt(showIdx)
    }
    const opts = {
        joinJson: {
            table: `show`,
            foreignKey: `showIdx`,
            type: "LEFT"
        },
        content: 'home'
    }
    const result = await showModule.select(whereJson, opts)
    console.log(result)
    if(result.isError)
    { 
        res.status(200).send(utils.successFalse(statusCode.NOT_FOUND, responseMessage.FAIL_READ_X('공연')))
    }
    else
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('공연'), result))
    }
})

//공연 리스트 조회
router.get('/', async(req, res) => {
    const result = await showModule.getShowList()
    res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X_ALL('공연'), result))
})

//공연 등록
router.post('/', upload.single('imageUrl'), async(req, res) => {
    if(!req.file)
    {
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE))
    }
    else{
        const imageUrl = req.file.location
        const name = req.body.name
        const originalPrice = req.body.originalPrice
        const discountPrice = req.body.discountPrice
        const location = req.body.location
        const accountHolder = req.body.accountHolder
        const accountNumber = req.body.accountNumber
        const showInfo = {
            imageUrl,
            name,
            originalPrice,
            discountPrice,
            location,
            accountHolder,
            accountNumber
        }
        const result = await showModule.apply(showInfo)
        if(result)
            res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_X('공연')))
    }
})

//공연 삭제
router.delete('/:id', async(req, res) => {
    const showIdx = req.params.id
    const whereJson = {
        showIdx
    }
    const result = await showModule.remove(whereJson)
    if(!result.isError)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.REMOVED_X('공연')))
    }
    else
    {
        res.status(200).send(result.jsonData)
    }
})

module.exports = router
