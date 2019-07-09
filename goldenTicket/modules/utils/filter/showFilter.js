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
    console.log(showData)
    const duration = stringifyDuration(durationFormatting(showData[0].startDate), durationFormatting(showData[0].endDate))
    const schedule = showData.map((e) => {
            return {
                schedule_idx: e.scheduleIdx,
                time: timeFormatting(e.date, e.startTime),
                draw_available: e.drawAvailable
            }
        })
    return {
        show_idx: showData[0].showIdx,
        image_url: showData[0].imageUrl,
        name: showData[0].name,
        location: showData[0].location,
        duration: duration,
        original_price: showData[0].originalPrice,
        discount_price: showData[0].discountPrice,
        background_image: showData[0].backgroundImage,
        schedule : schedule
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