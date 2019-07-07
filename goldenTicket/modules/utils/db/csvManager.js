const responseMEssage = require('../../utils/rest/responseMessage')
const fs = require('fs')
const json2csv = require('json2csv')
const csv = require('csvtojson')
const moment = require('moment')

const csv_url = '../../../public/csv/'
const log_url = '../../../public/log/'

const csvManager = {
    csvWrite: (fileName, jsonArray) => {
        return new Promise((resolve, reject) => {
            console.log(JSON.stringify(jsonArray))
            const resultCsv = json2csv.parse(jsonArray)
            console.log(resultCsv)
            fs.writeFile(`${csv_url}${fileName}`, resultCsv, (err) => {
                if (err) {
                    console.log(`file save(${csv_url}${fileName}) err: ${err}`)
                    reject(err)
                    return
                }
                console.log(`All of complete(${csv_url}${fileName})`)
                resolve(true)
            })
        })
    },
    csvRead: (fileName) => {
        return new Promise((resolve, reject) => {
            try {
                if (fs.existsSync(`${csv_url}${fileName}`) == false) {
                    throw Error(responseMEssage.FAIL_CSV_READ)
                }
            } catch (err) {
                console.log(`file(${csv_url}${fileName}) not exist`)
                resolve(Array())
                return
            }
            csv().fromFile(`${csv_url}${fileName}`).then((jsonArr) => {
                if (!jsonArr) {
                    console.log(`file read(${csv_url}${fileName}) err: ${err}`)
                    reject(responseMEssage.FAIL_CSV_READ)
                    return
                }
                for (const idx in jsonArr) {
                    if (!jsonArr[idx].write_date) continue
                    jsonArr[idx].write_date = jsonArr[idx].write_date
                }
                console.log(`All of complete(${csv_url}${fileName})!`)
                resolve(jsonArr)
            }, (err) => {
                console.log(`err with readCSV: ${err}`)
                reject(responseMEssage.FAIL_CSV_READ)
            })
        })
    },
    csvReadSingle: (fileName, idx) => {
        return new Promise(async (resolve, reject) => {
            const jsonArr = await csvManager.csvRead(fileName)
            let jsonData = null
            for (const i in jsonArr) {
                if (jsonArr[i].idx == idx) {
                    jsonData = jsonArr[i]
                    break
                }
            }
            if (jsonData == null) {
                reject(responseMEssage.NO_INDEX)
                return
            }
            resolve(jsonData)
        })
    },
    csvAdd: async (fileName, jsonData) => {
        const jsonArr = await csvManager.csvRead(fileName)
        let prevIdx = 0
        if (jsonArr.length > 0)
            prevIdx = parseInt(jsonArr[jsonArr.length - 1].idx)
        console.log(`prevId : ${prevIdx}`)
        jsonData.idx = parseInt(prevIdx + 1)
        jsonArr.push(jsonData)
        return csvManager.csvWrite(fileName, jsonArr)
    },
    logWrite: async (fileName, date, stringData) => {    
        const nowMoment = moment(date)
        const dateStr = nowMoment.format("YYYY-MM-DD HH:MM:SS")
        fs.appendFile(`${log_url}${fileName}`, `[${dateStr}] ${stringData}\n`, (err) => {
            if(err) throw err
            console.log(`saved log ${stringData}`)
        })
        return
    },
    CSV_READY_TO_LOTTERY_LIST: "ready2lotteryList.csv",
    LOG_TO_UPDATE_AVAILABLE: "log2updateAvailable.csv"
}

module.exports = csvManager