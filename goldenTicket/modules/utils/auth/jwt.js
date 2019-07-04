var randToken = require('rand-token')
const jwt = require('jsonwebtoken')
const secretKey = require('../../../config/jwtSecretKey')
const secretOrPrivateKey = secretKey.secretOrPrivateKey
const options = secretKey.jwtOptions
const refreshOptions = secretKey.jwtRefreshOptions

const TOKEN_EXPIRED = -3
const TOKEN_INVALID = -2
module.exports = {
    sign: (user) => {
        const payload = {
            userIdx: user.userIdx,
            name: user.name,
        }
        const result = {
            token: jwt.sign(payload, secretOrPrivateKey, options),
            refresh_token: randToken.uid(256) //발급받은 refreshToken은 반드시 디비에 저장해야 한다.
        }
        //refreshToken을 만들 때에도 다른 키를 쓰는게 좋다.
        //대부분 2주로 만든다.
        return result
    },
    verify: (token) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secretOrPrivateKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                return TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    },
    getPayload: (token) => {
        let decoded
        try {
            decoded = jwt.verify(token, secretOrPrivateKey, {
                ignoreExpiration: true
            })
        } catch (err) {
            if (err.message === 'invalid token') {
                console.log('invalid token')
                return TOKEN_INVALID
            } else {
                console.log("invalid token")
                return TOKEN_INVALID
            }
        }
        return decoded
    },
    refresh: (user) => {
        const payload = {
            userIdx: user.userIdx,
            name: user.name
        }
        return jwt.sign(payload, secretOrPrivateKey, options);
    },
    TOKEN_EXPIRED: TOKEN_EXPIRED,
    TOKEN_INVALID: TOKEN_INVALID
}