const { InvalidCommand } = require("./invalidCommand")
const { StartCommand } = require("./startCommand")
const { isClearCacheArgument, isStartServerArgument } = require("../arguments")
const { ClearCacheCommand } = require("./clearCacheCommand")
const { Cache } = require("../model/cache")

class CommandFactory {
  static getCommand(args) {
    if (args["_"].length > 0) {
      return new InvalidCommand()
    } else if (isClearCacheArgument(args)) {
      return new ClearCacheCommand(Cache)
    } else if (isStartServerArgument(args)) {
      return new StartCommand(args["--port"], args["--origin"])
    } else {
      return new InvalidCommand()
    }
  }
}

module.exports = { CommandFactory }
