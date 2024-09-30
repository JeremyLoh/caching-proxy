const { printProgramName } = require("../format")
const { Server } = require("../server")

class StartCommand {
  constructor(port, origin) {
    this.port = port
    this.origin = origin
    this.server = null
  }

  async execute() {
    // TODO refactor to only have one server, but different ports are created
    this.server = new Server(this.port, this.origin)
    try {
      await this.server.start(printProgramName)
    } catch (error) {
      console.error(error.message)
    }
  }
}

module.exports = { StartCommand }
