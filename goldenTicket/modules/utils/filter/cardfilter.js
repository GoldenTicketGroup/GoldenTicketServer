const cardFilter = {

    detailCardFilter : (cardData) => {

        // const date = JSON.stringify(e.date).split('-').join('.').substring(1,11)
        const content = cardData.map((e) => {
                return {
                    schedule_idx: e.scheduleIdx,
                    time: TimeFormatting(e.date, e.startTime)
                }
            })
        return {
            card_idx: cardData[0].cardIdx,
            image_url: cardData[0].imageUrl,
            content: cardData[0].content,
            title: cardData[0].title,
            content : content 
            }
        },

}

    module.exports = showFilter

    "card_idx": 1,
        "imageUrl": "https://sopt24server.s3.ap-northeast-2.amazonaws.com/1562165435447.jpeg",
        "content": "공휴일 많았던 가정의 달, 5월이 끝나간다고 아쉬워하지 마세요. 6월에도 현충일을 끼고 '징검다리 연휴'가 있으니까요. 짧은 연휴지만 알차게 보내고 싶다면 공연장 나들이는 어떨까요? 6월에 보기 좋은 6편의 공연을 소개합니다.",
        "title": "7월 연휴, 공연장 나들이 어때요?",
        "category": "이번 달 공연",