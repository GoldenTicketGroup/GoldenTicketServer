const jwt = require('./jwt')
const MSG = require('../rest/responseMessage')
const CODE = require('../rest/statusCode')
const UTIL = require('../rest/utils')

const authUtil = {
    //middlewares
    //미들웨어로 token이 있는지 없는지 확인하고
    //token이 있다면 jwt.verify함수를 이용해서 토큰 hash를 확인하고 토큰에 들어있는 정보 해독
    //해독한 정보는 req.decoded에 저장하고 있으며 이후 로그인 유무는 decoded가 있는지 없는지를 통해 알 수 있음
    isLoggedin: async (req, res, next) => {
        var token = req.headers.token
        if (!token) {
            return res.json(UTIL.successFalse(CODE.BAD_REQUEST, MSG.EMPTY_TOKEN))
        }
        const user = jwt.verify(token)
        if (user == this.TOKEN_EXPIRED) {
            return res.json(UTIL.successFalse(CODE.UNAUTHORIZED, MSG.EXPIRED_TOKEN))
        }
        if (user == this.TOKEN_INVALID) {
            return res.json(UTIL.successFalse(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN))
        }
        if (user.userIdx == undefined) {
            return res.json(UTIL.successFalse(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN))
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
                return res.json(UTIL.successFalse(CODE.UNAUTHORIZED, MSG.EXPRIED_TOKEN))
            } else if (user == jwt.TOKEN_INVALID) {
                return res.json(UTIL.successFalse(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN))
            } else {
                req.decoded = user
                next()
            }
        }
    },
}
module.exports = authUtil