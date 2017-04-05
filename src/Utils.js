module.exports = {
    defaults (object, defaultObject) {
        const obj = {}

        object = object !== undefined && object !== null ? object : {}
        for (const i in defaultObject) {
            if (object[i] !== undefined) {
                obj[i] = object[i]
            } else {
                obj[i] = defaultObject[i]
            }
        }
        return obj
    },
    isFunction (f) {
        return ({}).toString.call (f) === "[object Function]"
    },
}
