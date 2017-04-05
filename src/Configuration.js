const { defaults, isFunction } = require ("./Utils")

const TConfiguration = function (conf) {
    const {
        errorOnUndefinedArgument,
        undefMessage,
        noArgMessage,
        help,
    } = defaults (conf, {
        errorOnUndefinedArgument: false,
        undefMessage: opt => console.log (`undefined option ${opt}`),
        noArgMessage: opt => console.log (`${opt} does not take arguments`),
        help: true,
    })

    return {
        get errorOnUndefinedArgument () {
            return errorOnUndefinedArgument
        },
        get undefMessage () {
            return undefMessage
        },
        get noArgMessage () {
            return noArgMessage
        },
        get help () {
            return help
        },
    }
}

TConfiguration.isValid = conf => {
    return typeof conf.errorOnUndefinedArgument === "boolean"
    && isFunction (conf.undefMessage)
    && isFunction (conf.noArgMessage)
    && typeof conf.help === "boolean"
}

module.exports = {
    TConfiguration,
}
