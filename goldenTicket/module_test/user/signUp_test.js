const userModule = require('../../models/user')

const signUp_test_success = async () => {
    const userResult = await userModule.select({email: "heesung_test@golden-ticket.com"}, {})
    const userIdx = userResult.userIdx
    if(userIdx) {
        await userModule.withdrawal({userIdx: userIdx})
    }
    console.log(`Case Success`)
    const result = await userModule.signUp("윤희성_테스트", "heesung_test@golden-ticket.com", "010-1111-3818", "1234")
    console.log(result)
}

const signUp_test_fail = async () => {
    console.log(`Case Fail 1 : 이미 존재 [이메일]`)
    const result1 = await userModule.signUp("윤희성", "heesung6701@naver.com", "010-0000-3818", "1234")
    console.log(result1)
    console.log(`Case Fail 1 : 이미 존재 [전화번호]`)
    const result2 = await userModule.signUp("윤희성", "heesung_test@naver.com", "010-2081-3818", "1234")
    console.log(result2)
}

const signUp_test = async () => {
    await signUp_test_success()
    await signUp_test_fail()
}
signUp_test()