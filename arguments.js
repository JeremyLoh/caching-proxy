const arg = require("arg")

const ARGUMENTS = {
  "--clear-cache": Boolean,
  "--port": Number,
  "--origin": String,
}

function getArgs(line) {
  return arg(ARGUMENTS, {
    argv: line.trim().split(/\s/),
  })
}

function isClearCacheArgument(args) {
  return args["--clear-cache"] && !args["--port"] && !args["--origin"]
}

function isStartServerArgument(args) {
  return (
    args["--port"] &&
    !isNaN(args["--port"]) &&
    args["--origin"] &&
    isValidUrl(args["--origin"]) &&
    !args["--clear-cache"]
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

module.exports = { getArgs, isClearCacheArgument, isStartServerArgument }
