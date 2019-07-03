const express = require('express');
const router = express.Router();
const scheduleModule = require('../../../models/schedule')
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const utils = require('../../../modules/utils/rest/utils')

//스케쥴 리스트 조회
router.get('/:id', async(req, res) => {
    const showIdx = req.params.id
    const whereJson = { showIdx }
    const result = await scheduleModule.select(whereJson)
    if(!result.isError)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.READ_X('스케쥴'), result))
    }
    else
    {
        res.status(200).send(result.jsonData)
    }
});

//스케쥴 등록
router.post('/', async(req, res) => {
    const date = req.body.date
    const startTime = req.body.startTime
    const endTime = req.body.endTime
    const showIdx = req.body.showIdx
    const scheduleInfo = {
        date, startTime, endTime, showIdx
    }
    const result = await scheduleModule.apply(scheduleInfo)
    if(!result.isError)
    {
        res.status(200).send(utils.successTrue(statusCode.OK, responseMessage.CREATED_X('스케쥴')))
    }
    else
    {
        res.status(200).send(result.jsonData)
    }
});

//스케쥴 수정
router.put('/', async(req, res) => {
    res.status(200).send("test3");
});

//스케쥴 삭제
router.delete('/', async(req, res) => {
    res.status(200).send("test3");
});

module.exports = router;
