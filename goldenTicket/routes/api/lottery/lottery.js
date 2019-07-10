const express = require('express')
const router = express.Router()
const lotteryModule = require('../../../models/lottery')
const authUtil = require("../../../modules/utils/security/authUtils")
const responseMessage = require('../../../modules/utils/rest/responseMessage')
const statusCode = require('../../../modules/utils/rest/statusCode')
const Utils = require('../../../modules/utils/rest/utils')
const filter = require('../../../modules/utils/filter/lotteryFilter')

// 티켓 응모하기(등록)
router.post('/', authUtil.isLoggedin, async (req, res) => {
    const scheduleIdx = req.body.schedule_idx
    const decoded = req.decoded
    const whereJson = {
        userIdx : decoded.userIdx,
        scheduleIdx : scheduleIdx
    }
    const result = await lotteryModule.apply(whereJson)
    console.log(result)
    if(result.isError)
    {
        res.status(200).send(result.jsonData)   
    }
    else{
        res.status(200).send(Utils.successTrue(statusCode.OK, responseMessage.CREATED_X('응모')))
    }
})

// 티켓 수정
router.put('/', async (req, res) => {
    res.status(200).send("lottery test2")
})

// 티켓 응모 상세 조회
router.get('/:id', authUtil.isLoggedin, async (req, res) => {
    const lotteryIdx = req.params.id
    const decoded = req.decoded
    const whereJson = {
        userIdx : decoded.userIdx,
        lotteryIdx : lotteryIdx
    }
    const opts = {
        joinJson: {
            table: `schedule`,
            foreignKey: `scheduleIdx`,
            type: "LEFT"
        }
    }
    const result = await lotteryModule.select(whereJson, opts)
    res.status(200).send(result.jsonData)
})

// 티켓 응모 리스트 조회
router.get('/', authUtil.isLoggedin, async (req, res) => {
    const decoded = req.decoded
    const whereJson = {
        userIdx : decoded.userIdx
    }
    const result = await lotteryModule.selectAll(whereJson)
    if(result.isError)
    {
        res.status(200).send(result.jsonData)
        return
    }
    res.status(200).send(Utils.successTrue(statusCode.OK, responseMessage.READ_X_ALL('응모'), filter.lotteryFilter(result)))
})

//티켓 응모 삭제
router.delete('/', authUtil.isLoggedin, async (req, res) => {
    const lotteryIdx = req.body.lotteryIdx
    const userIdx = req.decoded.userIdx
    const isAdmined = req.decoded.isAdmined
    //console.log("isadmined: "+isAdmined)
    if(isAdmined == 0){
        res.status(200).send(Utils.successFalse(statusCode.UNAUTHORIZED, responseMessage.NO_SELECT_AUTHORITY))
    }
    else{
        const whereJson = {
            lotteryIdx
        }
        const result = await lotteryModule.delete(whereJson)
        if(result.isError){
            res.status(200).send(result.jsonData)
            return true; //조건문으로 한 번 더 감싸져 있어서 return을 한 번 더 해주어야 오류가 안난다.
        }
        res.status(200).send(Utils.successTrue(statusCode.OK, responseMessage.REMOVED_X('응모')))
    }
})

module.exports = router
