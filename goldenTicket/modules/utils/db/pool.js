const poolPromise = require('../../../config/dbConfig')
const errorMsg = require('../common/errorUtils')

module.exports = {
    queryParam_None: async (...args) => {
        const query = args[0]
        let result, connection, pool
        try {
            pool = await poolPromise
            connection = await pool.getConnection() // connection을 pool에서 하나 가져온다.
            result = await connection.query(query) || null // query문의 결과 || null 값이 result에 들어간다.
        } catch (err) {
            console.log(err)
            connection.rollback(() => {})
        } finally {
            pool.releaseConnection(connection) // waterfall 에서는 connection.release()를 사용했지만, 이 경우 pool.releaseConnection(connection) 을 해준다.
            return result
        }
    },
    queryParam_Arr: async (...args) => {
        const query = args[0]
        const value = args[1] // array
        let result, connection, pool
        try {
            pool = await poolPromise
            connection = await pool.getConnection() // connection을 pool에서 하나 가져온다.
            result = await connection.query(query, value) || null // 두 번째 parameter에 배열 => query문에 들어갈 runtime 시 결정될 value
        } catch (err) {
            connection.rollback(() => {})
            next(err)
        } finally {
            pool.releaseConnection(connection) // waterfall 에서는 connection.release()를 사용했지만, 이 경우 pool.releaseConnection(connection) 을 해준다.
            return result
        }
    },
    queryParam_Parse: async (inputquery, inputvalue, next) => {
        const query = inputquery
        const value = inputvalue
        let result, connection, pool
        try {
            pool = await poolPromise
            connection = await pool.getConnection()
            result = await connection.query(query, value) || null
        } catch (err) {
            // console.log(err)
            connection.rollback(() => {})
            result = new errorMsg(true, err)
        } finally {
            pool.releaseConnection(connection)
            return result
        }
    },
    Transaction: async (...args) => {
        let result = "Success"
        let connection, pool
        try {
            pool = await poolPromise
            connection = await pool.getConnection()
            await connection.beginTransaction()
            await args[0](connection, ...args)
            await connection.commit()
        } catch (err) {
            console.log(err)
            await connection.rollback()
            console.log("mysql error! err log =>" + err)
            result = undefined
        } finally {
            pool.releaseConnection(connection)
            return result
        }
    }
}