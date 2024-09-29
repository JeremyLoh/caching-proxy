const { InvalidCommand } = require("./invalidCommand")
const { StartCommand } = require("./startCommand")
const { isClearCacheArgument, isStartServerArgument } = require("../arguments")
const { ClearCacheCommand } = require("./clearCacheCommand")

class CommandFactory {
  static getCommand(args) {
    if (args["_"].length > 0) {
      return new InvalidCommand()
    } else if (isClearCacheArgument(args)) {
      // TODO get singleton cache for clearing
      return new ClearCacheCommand()
    } else if (isStartServerArgument(args)) {
      // TODO pass singleton cache to start command
      return new StartCommand(args["--port"], args["--origin"])
    } else {
      return new InvalidCommand()
    }
  }
}

module.exports = { CommandFactory }
