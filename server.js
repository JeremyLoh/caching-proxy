const express = require("express")
const { Cache } = require("./model/cache")
const { Response } = require("./model/response")

class Server {
  constructor(port, origin) {
    // origin is the URL where requests will be forwarded
    this.app = express()
    this.port = port
    this.origin = origin
    this.server = null
  }

  getOrigin() {
    return this.origin
  }

  async start(printProgramName) {
    return new Promise((resolve, reject) => {
      this.app.get("/favicon.ico", (req, res) => res.sendStatus(204))
      this.app.get("*", async (req, res) => {
        await forwardRequest(req, res, this)
        printProgramName()
      })
      this.server = this.app
        .listen(this.port, () => {
          console.log(`Server started on port ${this.port}`)
          resolve()
        })
        .on("error", () => {
          reject({
            message: `Could not start server on port ${this.port}. Please try a different port`,
          })
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

async function forwardRequest(req, res, server) {
  const { default: ky } = await import("ky")
  const url = req.url
  const requestedUrl = `${server.getOrigin()}${url}`
  let request = Cache.findRequest(url)
  if (request) {
    res.setHeader("X-Cache", "HIT")
  } else {
    res.setHeader("X-Cache", "MISS")
    const response = await ky.get(requestedUrl)
    const responseModel = new Response({
      status: response.status,
      headers: response.headers,
      body: await response.json(),
    })
    Cache.setRequest(url, responseModel)
    request = responseModel
  }

  for (const [k, v] of request.getHeaders().entries()) {
    res.setHeader(k, v)
  }
  res.set(
    "content-type",
    request.getHeaders().get("Content-Type") ||
      request.getHeaders().get("content-type")
  )
  // prevent response ERR_CONTENT_DECODING_FAILED - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
  res.removeHeader("content-encoding")
  res.removeHeader("Content-Encoding")
  res.send(JSON.stringify(request.getBody()))
  console.log(
    `Obtained response from ${requestedUrl} (Cache ${res.getHeader("X-Cache")})`
  )
}

module.exports = { Server }
