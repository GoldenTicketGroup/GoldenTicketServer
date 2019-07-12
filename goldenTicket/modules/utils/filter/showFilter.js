const moment = require('moment')

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
        return {
        show_idx: showData.showIdx,
        image_url: showData.detailImage,
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