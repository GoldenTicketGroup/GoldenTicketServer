const textSearchFilter = {

    searchFilter : (searchData, likeList) => {
        console.log(searchData)
        for(let i=0; i< searchData.length ;i++)
        {
            searchData[i].is_liked = likeList[i]
        }
        console.log(searchData)
        const filteredData = searchData.map((e) => {
            if(e.is_liked.length == 0)
            {
                return {
                    show_idx: e.showIdx,
                    image_url: e.detailImage,
                    name: e.name,
                    is_liked: 0
                }
            }
            else
            {
                return {
                    show_idx: e.showIdx,
                    image_url: e.detailImage,
                    name: e.name,
                    is_liked: 1
                }
            }
        })
        return filteredData
    }
}
module.exports = textSearchFilter