const moment = require('moment')

const TimeFormatting =  (date, time) =>
{
    const stringDate = JSON.stringify(date).split('-').join('.').substring(1,11)
    const dateString = `${stringDate} ${time} `
    const dateObject = moment(dateString).format("MM/DD/YYYY hh:mm:ss a")
    dateMomentObject = dateObject.substring(0, 21)
    return dateMomentObject
}

const lotteryFilter = {
    lotteryFilter : (lotteryData) => {
        console.log(lotteryData)
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