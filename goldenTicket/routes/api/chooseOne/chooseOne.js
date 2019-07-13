const express = require('express')
const router = express.Router()
const chooseOneModule = require('../../../models/chooseOne')
const authUtil = require("../../../modules/utils/security/authUtils")
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const Utils = require('../../../modules/utils/rest/utils')

//authUtil.isLoggedin, upload.single('imageUrl'),
router.post('/',  async (req, res) => {
    const imageUrl = req.body.imageUrl
    const userIdx = req.body.userIdx
    //const scheduleIdx = req.body.scheduleIdx
    //const seatIdx = req.body.seatIdx
    const whereJson = {
        imageUrl,
        userIdx
    }
    const result = await chooseOneModule.insert(whereJson)
    if(result.isError){
        res.status(200).send(result.jsonData)
        return
    }
    res.status(200).send(Utils.successTrue(statusCode.OK, responseMessage.CREATED_X('당첨')))
})

module.exports = router
