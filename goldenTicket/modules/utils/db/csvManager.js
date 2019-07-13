const responseMessage = require('../../utils/rest/responseMessage')
responseMessage.FAIL_CSV_READ = "CSV 읽기 실패"
responseMessage.FAIL_
const errorMsg = require('../common/errorUtils')
const fs = require('fs')
const json2csv = require('json2csv')
const csv = require('csvtojson')
const moment = require('moment')

const csv_url = './public/csv/'
const log_url = './public/log/'

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
    csvWriteSync: (fileName, jsonArray) => {
        console.log(JSON.stringify(jsonArray))
        const resultCsv = json2csv.parse(jsonArray)
        console.log(resultCsv)
        try{
            fs.writeFileSync(`${csv_url}${fileName}`, resultCsv)
        }catch(err){
            console.log(`file save(${csv_url}${fileName}) err: ${result}`)
            return new errorMsg(true, result)
        }
        console.log(`All of complete(${csv_url}${fileName})`)
        return true
        
    },
    csvRead: (fileName) => {
        return new Promise((resolve, reject) => {
            try {
                if (fs.existsSync(`${csv_url}${fileName}`) == false) {
                    throw Error(responseMessage.FAIL_CSV_READ)
                }
            } catch (err) {
                console.log(`file(${csv_url}${fileName}) not exist`)
                resolve(Array())
                return
            }
            csv().fromFile(`${csv_url}${fileName}`).then((jsonArr) => {
                if (!jsonArr) {
                    console.log(`file read(${csv_url}${fileName}) err: ${err}`)
                    reject(responseMessage.FAIL_CSV_READ)
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
                reject(responseMessage.FAIL_CSV_READ)
            })
        })
    },
    csvReadSync: async (fileName) => {
        try {
            if (fs.existsSync(`${csv_url}${fileName}`) == false) {
                return new errorMsg(true, responseMessage.FAIL_CSV_READ)
            }
        } catch (err) {
            console.log(`file(${csv_url}${fileName}) not exist`)
            return new errorMsg(true, err)
        }
        const result = await csv().fromFile(`${csv_url}${fileName}`)

        if(!result) {
            console.log(`file read(${csv_url}${fileName}) err: ${err}`)
            return new errorMsg(true, result)
        }
        console.log(`All of complete(${csv_url}${fileName})!`)
        return result
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
                reject(responseMessage.NO_INDEX)
                return
            }
            resolve(jsonData)
        })
    },
    csvReadSingleSync: async (fileName, idx) => {
        const jsonArr = await csvManager.csvRead(fileName)
        let jsonData = null
        for (const i in jsonArr) {
            if (jsonArr[i].idx == idx) {
                jsonData = jsonArr[i]
                break
            }
        }
        if (jsonData == null) {
            return new errorMsg(true, responseMessage.NO_INDEX)
        }
        return jsonData
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
    logWrite: async (fileName, stringData, date) => {
        if(date == null) date = new Date()
        
        const nowMoment = moment(date)
        const dateStr = nowMoment.format("YYYY-MM-DD HH:MM:SS")
        console.log(`[${dateStr}] ${stringData}`)
        return
        fs.appendFile(`${log_url}${fileName}`, `[${dateStr}] ${stringData}\n`, (err) => {
            if (err) new Error(err)
            console.log(`saved log ${stringData}`)
        })
        return
    },
    CSV_READY_TO_SCHEDULE_LIST: "ready2scheduleList.csv",
    CSV_LOTTERY_LIST_WITH_SCHEDULE_CACHE: (idx) => `lotterySaveCache_${idx}.csv`,
    LOG_TO_UPDATE_AVAILABLE: "log2updateAvailable.csv",
    LOG_DURING_SAVE_CACHE: "logDuringSaveCache.csv",
    LOG_DURING_CHOOSE_WIN: "logDuringChooseWin.csv",
}

module.exports = csvManager