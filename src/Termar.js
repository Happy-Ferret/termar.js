const { TConfiguration } = require ("./Configuration")
const { TCommand } = require ("./Command")

const Termar = function(argv) {
    let configuration = TConfiguration ()
    let defaultCallback = _ => 0
    let appName = null
    let listOfCommands = []
    const getHelp = _ => {
        let msg = `Usage: ${appName} --option argument
        or ${appName} --alias argument
        or ${appName} -s argument where s is a shortcut for the option
        
        ${listOfCommands.length > 0 ? "[options]\n" : ""}`.replace (/^[ \t]+/mg, "")
        
        for (const com of listOfCommands) {
            msg += `\
                .${com.name}
                aliases: --${com.name} ${(com.aliases.length > 0 ? "--" : "") + com.aliases.join (", --")}
                shorcuts: ${com.shortcut !== "" ? "-" + com.shortcut : ""}
                description: ${com.description}

            `.replace (/^[ \t]+/mg, "")
        }
        console.log (msg)
    }

    listOfCommands.push ()

    return {
        process (argv) {
            if (!Array.isArray (argv)) throw new Error ("Termar: Bad argument given to Termar.process")
            appName = argv[0].split ("/").pop ().split ("\\").pop ()
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
                        argv[i] = argv[i].slice (1)
                        const command = listOfCommands
                            .find (c => c.shortcut === argv[i] 
                                || c.aliases.indexOf (argv[i] ) > -1)

                        if (command === undefined) {
                            if (configuration.errorOnUndefinedArgument)
                                throw new Error ("Termar: " + configuration.undefMessage (argv[i]))
                            return 
                        }
                        if (command.argumentsName.length === 0) {
                            command.callback ()
                        } else {
                            command.callback (argv[i + 1])
                            i += 1
                        }
                    } else {
                        const opts = argv[i].split ("")

                        for (const opt of opts) {
                            const command = (opts.length > 1 ?
                            composableCommands.find (c => c.shortcut === opt) : 
                                listOfCommands.find (c => c.shortcut === opt)
                                )                           

                            if (command === undefined) {
                                if (configuration.errorOnUndefinedArgument) {
                                    const e = configuration.undefMessage (argv[i])
                                    
                                    throw new Error (`Termar:  ${e}`)
                                }
                                return 
                            }
                                
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
            if (TCommand.isValid (com)) {
                const last = listOfCommands
                    .find (m => m.aliases.concat (m.name)
                    .some (n => com.aliases.concat (com.name).indexOf (n) > -1)
                    )
                const index = listOfCommands.indexOf (last)

                listOfCommands = listOfCommands.slice (0, index)
                    .concat (listOfCommands.slice (index))
                listOfCommands.push (com)
            } else throw new Error ("Termar: Command is not valid")
            return this
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
                    this.addCommand (TCommand ({
                        name: "help",
                        shortcut: "h",
                        composable: false,
                        callback: (_ => getHelp ()),
                        description: "Displays this help.",
                    }))
            } else {
                throw new Error ("Termar: Configuration is not valid")
            }
        },
        set defaultCallback (callback) {
            defaultCallback = callback
        },
    }.addCommand (TCommand ({
        name: "help",
        shortcut: "h",
        composable: false,
        callback: (_ => getHelp ()),
        description: "Displays this help.",
    }))
}

module.exports.Termar = Termar
