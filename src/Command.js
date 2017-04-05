const { defaults, isFunction } = require ("./Utils")

const TCommand = function (options) {
    const getFunctionArgsName = f => {
        const str = f.toString ()
        let args = null

        if (str.startsWith ("function")) {
            const match = str.match (/^function[^(]*\(([^)]*)\)/m)

            if (match) args = match[1].split (",").map (s => s.replace (/\s*/, ""))
        } else if (str.startsWith ("(")) {
            const match = str.match (/^\(([^)]*)\)/)

            if (match) args = match[1].split (",").map (s => s.replace (/\s*/, ""))
        } else {
            const match = str.match (/^([^=]+)=>/)

            if (match) {
                args = [match[1].replace (/\s*/, "")]
                args = args.filter (e => e !== "_")
            }
        }
        if (args === null) {
            throw new Error ("Termar: Invalid callback arguments")
        }
        args = args.filter (e => e !== "" )
        return args
    }
    const argumentsName = !isFunction (options.callback) ?
                [] : getFunctionArgsName (options.callback)
    const {
        name,
        aliases,
        shortcut,
        composable,
        required,
        callback,
        description,
        howto,
    } = defaults (options, {
        name: "",
        aliases: [],
        shortcut: "",
        composable: !(options.shortcut === undefined || options.shortcut === null || options.shortcut === ""),
        required: false,
        callback: _ => 0,
        description: "",
        howto: `--${options.name} ${argumentsName.join ("")}`,
    })

    if (name === "") throw new Error ("Termar: TCommand needs a name")
    if (argumentsName.lenght > 1) throw new Error ("Termar: TCommand can not take more than an argument")


    return {
        get description () {
            return description
        },
        get name () {
            return name
        },
        get required () {
            return required
        },
        get shortcut () {
            return shortcut
        },
        get aliases () {
            return aliases
        },
        get composable () {
            return composable
        },
        get howto () {
            return howto
        },
        get callback () {
            return callback
        },
        get argumentsName () {
            return argumentsName
        },
    }
}


TCommand.isValid = com => {
    return typeof com.description === "string"
    && typeof com.name === "string"
    && typeof com.required === "boolean"
    && typeof com.shortcut === "string"
    && Array.isArray (com.aliases)
    && typeof com.composable === "boolean"
    && typeof com.howto === "string"
    && isFunction (com.callback)
    && Array.isArray (com.argumentsName)
}

module.exports = {
    TCommand,
}
