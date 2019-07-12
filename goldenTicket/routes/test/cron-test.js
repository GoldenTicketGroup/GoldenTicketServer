const express = require('express')
const scheduler = require('../../modules/utils/scheduler/scheduler')

const router = express.Router()

router.get('/chooseWin/:schedulerIdx', async (req, res) => {
    const input_scheduleIdx = req.params.schedulerIdx
    const result = await scheduler.forceChooseWin(input_scheduleIdx)
    res.status(200).send(result)
})

router.post('/ready2choose', async (req, res) => {
    const date = req.body.date == undefined ? new Date() : req.body.date
    const result = await scheduler.forceReady2Choose(date)
    res.status(200).send(result)
})

module.exports = router