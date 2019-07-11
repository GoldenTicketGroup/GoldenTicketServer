const userModule = require('../../../models/user')
const FCM = require('fcm-node')
const fcmServerKey = require('../../../config/fcmServerKey').key
const fcm = new FCM(fcmServerKey)

const pushData = {
	fcmSend : async (userIdx, message) => {
    const whereJson = {
        userIdx
    }
    const opts = {
        fields: `fcmToken`
    }
    const fcmTokenResult= await userModule.select(whereJson, opts)
    console.log(fcmTokenResult)
    const clientToken = fcmTokenResult.fcmToken
    const push_data = {
        to: clientToken,
    // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
        notification: {
        title: "골든 티켓",
        body: message,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon"
        },
    // 메시지 중요도
    priority: "high",
    // App 패키지 이름
    restricted_package_name: "com.example.goldenticket",
<<<<<<< Updated upstream
=======
    data: {  //you can send only notification or only data(or include both)
        title: '김강희',
        content: '안드로이드'
    }
>>>>>>> Stashed changes
    }
    fcm.send(push_data, function(err, response)
    {
        console.log(push_data)
        if (err) {
            console.error('Push메시지 발송에 실패했습니다.')
            console.error(err)
            return -1
        }
    console.log('Push메시지가 발송되었습니다.')
    })
        return
    }
}
module.exports = pushData

<<<<<<< Updated upstream
result = pushData.fcmSend(4, '테스트내용')
=======
result = pushData.fcmSend(4, '김강희', '안드로이드')
>>>>>>> Stashed changes