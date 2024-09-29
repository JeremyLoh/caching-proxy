const { printProgramName } = require("../format")
const { Server } = require("../server")

class StartCommand {
  constructor(port, origin) {
    this.port = port
    this.origin = origin
    this.server = null
  }

  async execute() {
    this.server = new Server(this.port, this.origin)
    await this.server.start(printProgramName)
  }
}

module.exports = { StartCommand }
