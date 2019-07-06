const userModule = require('../../models/user')

const edit_test_success = async () => {
    console.log('Case 성공')
    const result = await userModule.edit("윤희성_수정테스트",undefined, undefined, "1234",36)
    console.log(result)
}

const edit_test_fail = async () => {
    console.log('Case 실패 : 아무것도 들어오지 않는 경우')
    const result1 = await userModule.edit(undefined,undefined, undefined, "1234", 36)
    console.log(result1)

    console.log('Case 실패 : 전화번호가 존재하는 경우')
    const result2 = await userModule.edit(undefined,undefined, "010-1111-3818", "1234", 36)
    console.log(result2)

    console.log('Case 실패 : 이메일이 이미 존재하는 경우 ')
    const result3 = await userModule.edit(undefined,"heesung_test@golden-ticket.com", undefined, "1234", 36)
    console.log(result3)

    
    console.log('Case 실패 : 비밀번호가 다른 경우')
    const result4 = await userModule.edit(undefined,undefined, "010-1111-3818", "12345", 36)
    console.log(result4)
}

const signUp_test = async () => {
    await edit_test_success()
    await edit_test_fail()
}
signUp_test()