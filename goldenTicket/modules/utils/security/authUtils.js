const jwt = require('./jwt')
const resMessage = require('./responseMessage')
const statusCode = require('./statusCode')
const util = require('./utils')

const authUtil = {
    //middlewares
    //미들웨어로 token이 있는지 없는지 확인하고
    //token이 있다면 jwt.verify함수를 이용해서 토큰 hash를 확인하고 토큰에 들어있는 정보 해독
    //해독한 정보는 req.decoded에 저장하고 있으며 이후 로그인 유무는 decoded가 있는지 없는지를 통해 알 수 있음
    isLoggedin: async (req, res, next) => {
        var token = req.headers.token
        if (!token) {
            return res.json(util.successFalse(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN))
        }
        const user = jwt.verify(token)
        if (user == this.TOKEN_EXPIRED) {
            return res.json(util.successFalse(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN))
        }
        if (user == this.TOKEN_INVALID) {
            return res.json(util.successFalse(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN))
        }
        if (user.userIdx == undefined) {
            return res.json(util.successFalse(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN))
        }
        req.decoded = user
        next()
    },
    checkToken: async (req, res, next) => {
        var token = req.headers.token
        if (!token) {
            req.decoded = null
            next()
        } else {
            const user = jwt.verify(token)
            if (user == jwt.TOKEN_EXPIRED) {
                return res.json(util.successFalse(statusCode.UNAUTHORIZED, resMessage.EXPRIED_TOKEN))
            } else if (user == jwt.TOKEN_INVALID) {
                return res.json(util.successFalse(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN))
            } else {
                req.decoded = user
                next()
            }
        }
    },
}
module.exports = authUtil