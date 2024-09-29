const { EOL } = require("node:os")

class InvalidCommand {
  constructor() {}
  async execute() {
    printHelpUsage()
  }
}

function printHelpUsage() {
  console.log(
    EOL +
      "Invalid argument(s): " +
      EOL +
      "  Usage Example:" +
      EOL +
      "\t--port <number> --origin <url>" +
      EOL +
      "\t--clear-cache"
  )
}

module.exports = { InvalidCommand }
