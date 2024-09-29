const express = require("express")

class Server {
  constructor(port, origin) {
    // origin is the URL where requests will be forwarded
    this.app = express()
    this.port = port
    this.origin = origin
    this.server = null
  }

  async start(printProgramName) {
    return new Promise((resolve, reject) => {
      this.app.get("/favicon.ico", (req, res) => res.sendStatus(204))
      this.app.get("*", (req, res, next) => {
        forwardRequest(req, res, next)
        printProgramName()
      })
      this.server = this.app.listen(this.port, () => {
        console.log(`Server started on port ${this.port}`)
        resolve()
      })
    })
  }

  async stop(printProgramName) {
    return new Promise((resolve, reject) => {
      this.server.close((error) => {
        printProgramName()
        console.log("Closed server")
        if (error) {
          console.error(error.message)
          reject(error)
        }
        resolve()
      })
    })
  }
}

function forwardRequest(req, res, next) {
  // TODO perform request and cache url with TTL
  const url = req.url
  console.log({ requrl: req.url })
  res.send(null)
}

module.exports = { Server }
