const arrayParser = {
    stringToArray: (str) => {
        const arr = []
        let buf = ""
        for (let i = 1; i < str.length - 1; i++) {
            if (str[i] == '"' || str[i] == ',') {
                if (buf.length > 0) {
                    arr.push(buf)
                }
                buf = ""
                continue
            }
            buf = buf + str[i]
        }
        return arr
    },
}

module.exports = arrayParser