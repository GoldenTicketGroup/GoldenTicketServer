const errorMsg = require('../common/errorUtils')
const MSG = require('../rest/responseMessage')

const TABLE_SHOW = '`show`'
const TABLE_SCHEDULE = 'schedule'
const TABLE_LOTTERY = 'lottery'
const TABLE_TICKET = 'ticket'
const TABLE_LIKE = 'like'
const TABLE_USER = 'user'
const TABLE_POST = 'post'
const TABLE_CARD = 'card'
const TABLE_HASHTAG = 'hashtag'

function makeGroupByQuery(groupBy) {
    if (groupBy == undefined) return ""
    let groupByStr = `GROUP BY ${groupBy}`
    return groupByStr
}

function makeJoinQuery(joinJson) {
    if (joinJson == undefined) return ""
    if (joinJson.table == undefined ||
        joinJson.foreignKey == undefined ||
        joinJson.type == undefined) {
        console.log(joinJson)
        throw "The joinJson is Wrong format on makeJoinQuery()"
    }
    let joinStr = `${joinJson.type} JOIN ${joinJson.table} USING (${joinJson.foreignKey})`
    return joinStr
}

function makeOrderByQuery(orderByJson) {
    if (orderByJson == undefined) return ""
    let orderByStr = "ORDER BY"
    for (let key in orderByJson) {
        orderByStr = `${orderByStr} ${key} ${orderByJson[key]}`
    }
    return orderByStr
}

function makeWhereQuery(whereJson) {
    if (whereJson == undefined || Object.keys(whereJson).length == 0) return ""
    let conditions = ""
    for (let key in whereJson) {
        const condition = (whereJson[key].equ == undefined) ? `${key} = '${whereJson[key]}'` : `${key} ${whereJson[key].equ} '${whereJson[key].value}'`
        conditions = `${conditions} AND ${condition}`
    }
    whereStr = `WHERE ${conditions.substring(5)}` // conditions가 ' AND ' 로 시작하기 때문에 제거해준다.
    return whereStr
}

function makeConditions(whereJson) {
    let conditions = ""
    for (let key in whereJson) {
        const condition = `${key} = '${whereJson[key]}'`
        conditions = `${conditions},${condition}`
    }
    return conditions.substring(1)
}

function makeFieldsValueQuery(jsonData) {
    const values = []
    let fields = ""
    let questions = ""
    for (let key in jsonData) {
        const column = key
        const value = jsonData[key]
        fields = fields + "," + column
        values.push(value)
        questions = questions + ",?"
    }
    return {
        fields: fields.substring(1),
        questions: questions.substring(1),
        values: values
    }
}

const sqlManager = {
    db_select: async (func, table, whereJson, opts) => {
        if(opts == undefined) opts = {}
        const whereStr = makeWhereQuery(whereJson, ' AND ')
        const fieldsJson = opts.fields || '*'
        const joinStr = makeJoinQuery(opts.joinJson)
        const groupByStr = makeGroupByQuery(opts.groupBy)
        const orderByStr = makeOrderByQuery(opts.orderBy)
        const query = `SELECT ${fieldsJson} FROM ${table} ${joinStr} ${whereStr} ${groupByStr} ${orderByStr}`
        const result = await func(query)
        if (result == null) return false
        return result
    },
    db_insert: async (func, table, jsonData) => {
        const resultQuery = makeFieldsValueQuery(jsonData)
        const values = resultQuery.values
        const fields = resultQuery.fields
        const questions = resultQuery.questions
        const query = `INSERT INTO ${table}(${fields}) values(${questions})`
        const result = await func(query, values)
        if (result == null) return false
        if (result.isError == true) {
            if (result.jsonData.code == 'ER_DUP_ENTRY' || result.jsonData.errno == 1062) {
                return new errorMsg(true, MSG.ALREADY_X)
            }
            if (result.jsonData.code == 'ER_BAD_NULL_ERROR' || result.jsonData.errno == 1048) {
                return new errorMsg(true, MSG.NULL_VALUE)
            }
            if (result.jsonData.code == 'ER_NO_REFERENCED_ROW_2' || result.jsonData.errno == 1452) {
                console.log(result.jsonData)
                return new errorMsg(true, MSG.FAIL_DB_WRITE)
            }
            return false
        }
        return result
    },
    db_delete: async (func, table, whereJson) => {
        let whereStr = makeWhereQuery(whereJson)
        const query = `DELETE FROM ${table} ${whereStr}`
        const result = await func(query)
        if (result == null) return false
        return result
    },
    db_update: async (func, table, setJson, whereJson) => {
        const setConditions = makeConditions(setJson)
        const whereStr = makeWhereQuery(whereJson)
        const query = `UPDATE ${table} SET ${setConditions} ${whereStr}`
        const result = await func(query)
        if (result == null) return false
        return result
    },
    TABLE_SHOW: TABLE_SHOW,
    TABLE_SCHEDULE: TABLE_SCHEDULE,
    TABLE_LOTTERY: TABLE_LOTTERY,
    TABLE_TICKET: TABLE_TICKET,
    TABLE_LIKE: TABLE_LIKE,
    TABLE_USER: TABLE_USER,
    TABLE_POST: TABLE_POST,
    TABLE_CARD: TABLE_CARD,
    TABLE_HASHTAG: TABLE_HASHTAG,
}
module.exports = sqlManager

// test code
const module_test = () => {
    const test = (result) => {
        console.log(result)
        return result
    }
    const opts = {
        fieldsJson: `${TABLE_SHOW}.*`,
        joinJson: {
            table: 'hashtag',
            foreignKey: "showIdx",
            type: "LEFT"
        },
        groupBy: "keyword",
        orderBy: {
            "hashTagIdx": "DESC"
        }
    }
    console.log(opts)
    const res = sqlManager.db_select(test, TABLE_SHOW, {
        likes: {
            equ: 'LIKE',
            value: '%A'
        },
        id: '1234'
    }, opts)
    res.then((res) => {
        console.log(res)
    })
}
// module_test()
