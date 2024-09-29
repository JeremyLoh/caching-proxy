const readline = require("node:readline")
const arg = require("arg")
const { EOL } = require("node:os")
const { Server } = require("./server")
const { URL } = require("node:url")

let server = null
const ARGUMENTS = {
  "--clear-cache": Boolean,
  "--port": Number,
  "--origin": String,
}

async function main() {
  printProgramName()
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  })
  for await (const line of rl) {
    printProgramName()
    await processLine(line)
  }
}

async function processLine(line) {
  try {
    const args = arg(ARGUMENTS, {
      argv: line.trim().split(/\s/),
    })
    const isClearCache =
      args["--clear-cache"] && !args["--port"] && !args["--origin"]
    const isStartServer =
      args["--port"] &&
      !isNaN(args["--port"]) &&
      args["--origin"] &&
      isValidUrl(args["--origin"]) &&
      !args["--clear-cache"]

    if (args["_"].length > 0) {
      printHelpUsage()
    } else if (isClearCache) {
      // TODO clear cache
      console.log("CLEAR CACHE")
    } else if (isStartServer && server == null) {
      server = new Server(args["--port"], args["--origin"])
      await server.start(printProgramName)
    } else {
      printHelpUsage()
    }
  } catch (error) {
    console.error(error.message)
  } finally {
    printProgramName()
  }
}

function printProgramName() {
  process.stdout.write("caching-proxy > ")
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

function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

if (require.main === module) {
  // when a file is run directly from Node, require.main is set to its module
  main()
}

module.exports = { main }
