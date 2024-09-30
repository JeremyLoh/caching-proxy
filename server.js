const express = require("express")
const { Cache } = require("./model/cache")
const { Response } = require("./model/response")

class ProxyServer {
  constructor() {
    this.app = express()
    this.app.get("/favicon.ico", (req, res) => res.sendStatus(204))
    this.openPortServers = new Map()
  }

  async start({ port, origin, printProgramName }) {
    // origin is the URL where requests will be forwarded
    return new Promise((resolve, reject) => {
      if (this.openPortServers.has(port)) {
        reject({
          message: `There is an existing connection defined on port ${port}`,
        })
      }
      this.app.get("*", async (req, res) => {
        await forwardRequest(req, res, origin)
        printProgramName()
      })
      const openPortServer = this.app
        .listen(port, () => {
          console.log(`Server started on port ${port}`)
          resolve()
        })
        .on("error", () => {
          reject({
            message: `Could not start server on port ${port}. Please try a different port`,
          })
        })
      if (openPortServer) {
        this.openPortServers.set(port, openPortServer)
      }
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

async function forwardRequest(req, res, origin) {
  const { default: ky } = await import("ky")
  const url = req.url
  const requestedUrl = `${origin}${url}`
  let request = Cache.findRequest(requestedUrl)
  if (request) {
    res.setHeader("X-Cache", "HIT")
  } else {
    res.setHeader("X-Cache", "MISS")
    const response = await ky.get(requestedUrl)
    const contentType = response.headers.get("content-type")
    const responseModel = new Response({
      status: response.status,
      headers: response.headers,
      body: contentType.includes("text/html")
        ? await response.text()
        : await response.json(),
    })
    Cache.setRequest(requestedUrl, responseModel)
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

const Server = new ProxyServer()

module.exports = { Server }
