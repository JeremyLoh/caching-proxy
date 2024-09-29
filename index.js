const readline = require("node:readline")
const { Server } = require("./server")

const server = new Server(3000)

async function main() {
  printProgramName()
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  })
  for await (const line of rl) {
    // TODO have CLI app to get parameters to start server
    printProgramName()
    if (line === "start") {
      await server.start(printProgramName)
      printProgramName()
    }
    if (line === "stop") {
      await server.stop()
      printProgramName()
    }
  }
}

function printProgramName() {
  process.stdout.write("caching-proxy ")
}

if (require.main === module) {
  // when a file is run directly from Node, require.main is set to its module
  main()
}

module.exports = { main }
