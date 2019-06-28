const moment = require('moment')
const cron = require('node-cron')

const scheduleList = []
const scheduler = {
    startCron: () => {
        // 10시부터 22시까지 1시간 마다실행
        const task1 = cron.schedule('0 10-22/1 * * *', () => {
            console.log("1시간 마다 실행");
            console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
            console.log(`한시간 마다 push보내야할 로터리 확인 해야한다.`)
            // 로터리 리스트 가져오기 (from file)
            // random 알고리즘
            // db update(트랜잭션 처리) //이부분에서 메모리 초과 일어날 것같음. 추후에 update를 하기전에 csv로 저장하고 db로 업데이트
            // fcm 메세지 보내기
            // csv 정보를 clear한다.
        })
        // 10시 30분 부터 22시 30분 까지 1시간 마다 실행
        // csv로 미리 db에서 파일로 옮겨놓음 (캐시 역할), 
        const task2 = cron.schedule('30 10-22/1 * * *', () => {
            console.log("1시간 마다(30분에) 실행");
            console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
            console.log(`Database에서 추첨을 해야할 정보를 미리 파일로 가져온다.`);
            // 30분 이후 추첨에 사용될 데이터를 미리 database에서 가져온다.
            // csv에 저장한다.
        })
        scheduleList.push(task1)
        scheduleList.push(task2)
    },
    stopCron: () => {
        for(const schedule in scheduleList){
            schedule.stop()
        }
    },
    endCron: () => {
        for(const schedule in scheduleList){
            schedule.destroy()
        }
    }
}
module.exports = scheduler