const userModule = require('../../../models/user')
const FCM = require('fcm-node')
const fcmServerKey = require('../../../config/fcmServerKey').key
const fcm = new FCM(fcmServerKey)
var request = require('request')

const pushData = {
	fcmSend : async (userIdx) => {
    const whereJson = {
        userIdx
    }
    const opts = {
        fields: `fcmToken`
    }
    const fcmTokenResult= await userModule.select(whereJson, opts)
    const clientToken = fcmTokenResult.fcmToken
    var jsonDataObj = {
        "data": {
            "title": "골든",
            "content": "티켓"
        },
        "to": clientToken
    }
    request.post({
        headers: {'content-type': 'application/json',
        'authorization': `key=${fcmServerKey}`},
    url: 'https://fcm.googleapis.com/fcm/send',
    body: jsonDataObj,
    json: true
    }, function(err, response, body) {
            console.log(err)
            }
        )
    }
}
module.exports = pushData

result = pushData.fcmSend(4)
