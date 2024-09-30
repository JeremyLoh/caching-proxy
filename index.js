const readline = require("node:readline")
const { CommandFactory } = require("./commands/commandFactory")
const { printProgramName } = require("./format")
const { getArgs } = require("./arguments")

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
    const args = getArgs(line)
    const command = CommandFactory.getCommand(args)
    await command.execute()
  } catch (error) {
    console.error(error.message)
  } finally {
    printProgramName()
  }
}

if (require.main === module) {
  // when a file is run directly from Node, require.main is set to its module
  main()
}

module.exports = { main }
