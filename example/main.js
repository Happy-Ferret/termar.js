const { Termar, TCommand, TConfiguration } = require ("../src/lib.js")
const cli = Termar ()

cli.configuration = TConfiguration ({
    help: false,

})
cli.defaultCallback = e => {
    if (e.slice (-3) === ".js") return 
    let randomName = ""
    const length = Math.floor (Math.random () * 7 + 3)
    const chars = "abcdefghijklmnopqrstuvwxyz"

    for (let i = 0; i < length; i++) {
        randomName += chars [Math.floor (Math.random () * (chars.length + 1))]
    }
    console.log ("Is your name : " + randomName[0].toUpperCase () + randomName.slice (1))
}
cli.addCommand (TCommand ({
    name: "sayhello",
    aliases: ["hello"],
    shortcut: "s",
    callback: arg => console.log ("hello " + arg),
    description: "Says hello to the name given",
    howto: "-s [arg...]",
}))

cli.process (process.argv)
