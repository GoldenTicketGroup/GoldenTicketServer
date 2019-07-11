const moment = require('moment')

const TimeFormatting =  (date, time) =>
{
    date = JSON.stringify(date).split('-').join('.').substring(1,11)
    const dateString = `${date} ${time} `
    const dateObject = new Date(dateString)
    let dateMomentObject = moment(dateObject)
    dateMomentObject = dateMomentObject.format("MM/DD/YYYY hh:mm:ss a")
    dateMomentObject = dateMomentObject.substring(0, 21)
    return dateMomentObject
}

const lotteryFilter = {
    lotteryFilter : (lotteryData) => {
        const filteredData = lotteryData.map((e) => {
            return {
                show_idx: e.showIdx,
                lottery_idx: e.lotteryIdx,
                name: e.name,
                start_time: TimeFormatting(e.date, e.startTime)
            }
        })
        console.log(filteredData)

        return filteredData
    }
}
module.exports = lotteryFilter