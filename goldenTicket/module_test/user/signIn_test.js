const userModule = require('../../models/user')
const signIn_test_success = async() => {
    console.log('Case 성공')
    const result1 = await userModule.signIn("heesung6701@naver.com", "1234")
    console.log(result1)
}
const signIn_test_fail = async() => {
    console.log('Case 실패  : Wrong ID')
    const result2 = await userModule.signIn("heesung6701@naver.com2", "1234")
    console.log(result2)
    console.log('Case 실패 : Wrong Password')
    const result3 = await userModule.signIn("heesung6701@naver.com", "12345")
    console.log(result3)
}
const signIn_test = async () => {
    await signIn_test_success()
    await signIn_test_fail()
}
signIn_test()