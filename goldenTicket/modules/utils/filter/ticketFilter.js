const moment = require('moment')

const durationFormatting = (date) =>
{
    const dateString = `${date}`
    const dateObject = new Date(dateString)
    let dateMomentObject = moment(dateObject)
    dateMomentObject = dateMomentObject.format("YYYY년 MM월 DD일")
    return dateMomentObject
}


const stringifyDuration = (startDate, endDate) =>
{
    return startDate.substring(0,5).concat(" ~ ", endDate.substring(0,5))
}


const ticketFilter = {

    ticketFilter : (ticketData) => {
        ticketData.date = durationFormatting(ticketData.date)
        ticketData.running_time = stringifyDuration(ticketData.startTime, ticketData.endTime)
        ticketData.price = ticketData.price.concat("원")
        delete ticketData.startTime
        delete ticketData.endTime
        return ticketData
    }
}
module.exports = ticketFilter