const { TConfiguration } = require ("./Configuration")
const { TCommand } = require ("./Command")

const Termar = function(argv) {
    let configuration = TConfiguration ()
    let defaultCallback = _ => 0
    let appName = null
    const listOfCommands = []

    const getHelp = _ => {

    }

    return {
        process (argv) {
            if (!Array.isArray (argv)) throw new Error ("Termar: Bad argument given to Termar.process")
            appName = argv[0]
            argv = argv.slice (1)
            const defaultArgs = []
            let o = false
            const composableCommands = listOfCommands
                .filter (com => com.composable)

            for (let i = 0; i < argv.length; i++) {
                if (argv[i].startsWith ("-")) {
                    if (!o) {
                        o = true
                        defaultCallback.apply (null, defaultArgs)
                    }
                    argv[i] = argv[i].slice (1)
                    if (argv[i].startsWith ("-")) {

                    } else {
                        const opts = argv[i].split ("")

                        for (const opt of opts) {
                            const command = composableCommands
                                .find (c => c.shortcut === opt)

                            if (command === undefined 
                            && configuration.errorOnUndefinedArgument)
                                throw new Error ("Termar: " + configuration.undefMessage (argv[i]))
                            if (command.argumentsName.length === 0) {
                                command.callback ()
                            } else {
                                command.callback (argv[i + 1])
                                i += 1
                            }
                        }
                    }
                } else if (!o) {
                    defaultArgs.push (argv[i])
                } else if (configuration.errorOnUndefinedArgument)
                    throw new Error ("Termar: " + configuration.undefMessage (argv[i]))
            }
        },
        addCommand (com) {
            if (TCommand.isValid (com)) listOfCommands.push (com)
            else throw new Error ("Termar: Command is not valid")
        },
        get configuration () {
            return configuration 
        },
        get defaultCallback () {
            return defaultCallback 
        },
        set configuration (conf) {
            if (TConfiguration.isValid (conf)) {
                configuration = conf
                if (configuration.help)
                    listOfCommands.push (TCommand ({
                        name: "help",
                        shortcut: "h",
                        composable: false,
                        callback: (_ => getHelp ()),
                        description: "Displays the list of of commands and their description.",
                    }))
            } else {
                throw new Error ("Termar: Configuration is not valid")
            }
        },
        set defaultCallback (callback) {
            defaultCallback = callback
        },
    }
}

module.exports.Termar = Termar
