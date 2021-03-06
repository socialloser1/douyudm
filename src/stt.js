const util = require('./util')

function escape(value) {
    value = value.toString()
    value = value.replace(/@/g, '@A')
    value = value.replace(/\//g, '@S')
    return value
}

function unescape(value) {
    value = value.toString()
    value = value.replace(/@A/g, '@')
    value = value.replace(/@S/g, '/')
    return value
}

function serialize(data) {
    if (util.isObject(data)) {
        let str = ''
        for (let [key, value] of Object.entries(data)) {
            str += `${escape(serialize(key))}@=${escape(serialize(value))}/`
        }
        return str
    } else if (util.isArray(data)) {
        return data.map(value => `${escape(serialize(value))}/`).join('')
    } else if (util.isString(data) || util.isNumber(data)) {
        return data.toString()
    } else {
        return ''
    }
}

function deserialize(raw) {
    const result = {}
    if (util.isUndefined(result) || raw.length <= 0) {
        return result
    }

    let arr = raw.split('/')
    for (let i = arr.length - 2; i >= 0; i--) {
        let item = arr[i].split('@=')
        let k = item[0]
        let v = item[1]
        if (/^\w+@A=(.*?)@S$/.test(v)) {
            v = deserialize(unescape(v))
        }
        result[k] = v
    }

    return result
}

module.exports = {
    serialize,
    deserialize,
}