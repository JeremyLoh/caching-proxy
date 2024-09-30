const { printProgramName } = require("../format")
const { Server } = require("../server")

class StartCommand {
  constructor(port, origin) {
    this.port = port
    this.origin = origin
    this.server = Server
  }

  async execute() {
    try {
      await this.server.start({
        port: this.port,
        origin: this.origin,
        printProgramName,
      })
    } catch (error) {
      console.error(error.message)
    }
  }
}

module.exports = { StartCommand }
