const dayjs = require("dayjs")

class Response {
  constructor({ status, headers, body }) {
    this.status = status
    this.headers = new Map()
    for (const [k, v] of headers.entries()) {
      this.headers.set(k, v)
    }
    this.body = body
    this.createdAt = dayjs()
  }

  getBody() {
    return this.body
  }

  getHeaders() {
    return this.headers
  }

  getCreatedAt() {
    return this.createdAt
  }
}

module.exports = { Response }
