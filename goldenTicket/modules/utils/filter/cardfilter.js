const cardFilter = {

    detailCardFilter : (cardData) => {
        const content = cardData.map((e) => {
            return {
                title: "<".concat(e.contentTitle, ">"),
                subtitle: e.subtitle,
                image_url: e.contentImageUrl,
                content: e.showContent,
                show_idx: e.showIdx
            }
        })
        return {
            card_idx: cardData[0].cardIdx,
            image_url: cardData[0].imageUrl,
            card_content: cardData[0].content,
            title: cardData[0].title,
            category: cardData[0].category,
            content : content 
            }
        },

}

module.exports = cardFilter