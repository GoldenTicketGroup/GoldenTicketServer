const moment = require('moment')

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
const scheduleTimeFormatting =  (date, time) =>
{
    date = JSON.stringify(date).split('-').join('.').substring(1,11)
    const dateString = `${date} ${time} `
    const dateObject = new Date(dateString)
    let dateMomentObject = moment(dateObject)
    dateMomentObject = dateMomentObject.format("hh:mm:ss a MM/DD/YYYY")
    dateMomentObject = dateMomentObject.substring(0,8)
    return dateMomentObject
}

const durationFormatting = (date) =>
{
    const dateString = `${date}`
    const dateObject = new Date(dateString)
    let dateMomentObject = moment(dateObject)
    dateMomentObject = dateMomentObject.format("YYYY.MM.DD")
    return dateMomentObject
}

const stringifyDuration = (startDate, endDate) =>
{
    return startDate.substring(0,10).concat(" ~ ", endDate.substring(0,10))
}


const showFilter = {
    detailShowFilter : (showData) => {
    const duration = stringifyDuration(durationFormatting(showData.startDate), durationFormatting(showData.endDate))
    // const schedule = showData.map((e) => {
    //     const lotteryStartTime = (convertToSeconds('10:00:00'))
    //     const currentTime = (convertToSeconds(moment().format('hh:mm:ss')))
    //     const lotteryEndTime = (convertToSeconds(e.startTime)-10800)
    //     if(lotteryStartTime <= currentTime && currentTime <= lotteryEndTime)
    //     {
    //         return {
    //             schedule_idx: e.scheduleIdx,
    //             time: timeFormatting(e.date, e.startTime),
    //             draw_available: e.drawAvailable
    //         }
    //     }
    //     })
        return {
        show_idx: showData.showIdx,
        image_url: showData.imageUrl,
        name: showData.name,
        location: showData.location,
        duration: duration,
        original_price: showData.originalPrice,
        discount_price: showData.discountPrice,
        background_image: showData.backgroundImage,
        }
    },
    homeAllShowInfo : (showData) => {
    runningTime = showData.startTime.substring(0,5).concat(" ~ ", showData.endTime.substring(0,5))
    return {
        show_idx: showData.showIdx,
        image_url: showData.imageUrl,
        name: showData.name,
        location: showData.location,
        running_time : runningTime
        }
    },
    homeAllShowFilter : (showData) => {
    let filteredData = []
    var cnt = 0
    for(let i=0 ;i < Object.keys(showData).length - 1; i++)
    {
        if(showData[i].show_idx == showData[i+1].show_idx)
        {
            showData[i+1].running_time = showData[i].running_time.concat(" / ", showData[i+1].running_time)
            cnt++
        }
        else
        {
            if(cnt >= 2)
            {
                showData[i].running_time = showData[i].running_time.substring(0, 30).concat('...')
            }
            filteredData.push(showData[i])
            cnt = 0
        }
    }
    const last = showData[Object.keys(showData).length -1]
    if(cnt >= 2)
    {
       last.running_time = last.running_time.substring(0, 30).concat('...')
    }
    filteredData.push(showData[Object.keys(showData).length -1])

    return filteredData
    },
}

module.exports = showFilter