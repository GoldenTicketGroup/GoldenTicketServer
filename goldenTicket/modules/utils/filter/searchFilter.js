const textSearchFilter = {

    searchFilter : (searchData) => {
        const filteredData = searchData.map((e) => {
            return {
                show_idx: e.showIdx,
                image_url: e.detailImage,
                name: e.name
            }
        })
        return filteredData
    }
}
module.exports = textSearchFilter