const TABLE_X = 'x'

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
        return orderByStr
    }
}

function makeWhereQuery(whereJson) {
    if (whereJson == undefined) return ""
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
        return conditions.substring(1)
    }
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
        return {
            fields: fields.substring(1),
            questions: questions.substring(1),
            values: values
        }
    }
}

const sqlManager = {
    db_select: async (func, table, whereJson, opts) => {
        const whereStr = makeWhereQuery(whereJson, ' AND ')
        const fieldsJson = opts.fieldsJson || '*'
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
    TABLE_X: TABLE_X
}
module.exports = sqlManager

// test code

function test(result) {
    console.log(result)
    return result
}

const opts = {
    fieldsJson: `${TABLE_COMICS}.*`,
    joinJson: {
        table: 'hashtag',
        foreignKey: "comicsIdx",
        type: "LEFT"
    },
    groupBy: "keyword",
    orderBy: {
        "hashTagIdx": "DESC"
    }
}
console.log(opts)
const res = sqlManager.db_select(test, sqlManager.TABLE_COMICS, {
    likes: {
        equ: 'LIKE',
        value: '%A'
    },
    id: '1234'
}, opts)
res.then((res) => {
    console.log(res)
})