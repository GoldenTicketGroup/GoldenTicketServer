const moment = require('moment')

const convertToSeconds = (hms) => {
    var a = hms.split(':')
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
    return seconds
}

const timeFormatting =  (date, time) =>
{
    date = JSON.stringify(date).split('-').join('.').substring(1,11)
    const dateString = `${date} ${time} `
    const dateObject = new Date(dateString)
    let dateMomentObject = moment(dateObject)
    dateMomentObject = dateMomentObject.format("a hh:mm:ss MM/DD/YYYY")
    dateMomentObject = dateMomentObject.replace('pm', "오후")
    dateMomentObject = dateMomentObject.replace('am', "오전")
    dateMomentObject = dateMomentObject.substring(0,8)
    if(dateMomentObject.substring(3,4) == '0')
    {
        dateMomentObject = dateMomentObject.substring(0,3).concat(dateMomentObject.substring(4,8))
    }
    return dateMomentObject
}

const scheduleFilter = {
    detailScheduleFilter : (showData) => {
        console.log(showData)
        const schedule = showData.map((e) => {
            const lotteryStartTime = (convertToSeconds('10:00:00'))
            const currentTime = (convertToSeconds(moment().format('hh:mm:ss')))
            const lotteryEndTime = (convertToSeconds(e.startTime)-10800)
            if(lotteryStartTime <= currentTime && currentTime <= lotteryEndTime)
            {
                return {
                    schedule_idx: e.scheduleIdx,
                    time: timeFormatting(e.date, e.startTime),
                    draw_available: 1
                }
            }
            else
            {
                return {
                    schedule_idx: e.scheduleIdx,
                    time: timeFormatting(e.date, e.startTime),
                    draw_available: 0
                }
            }
            })
        return schedule
    }
}
module.exports = scheduleFilter