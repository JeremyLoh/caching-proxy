const dayjs = require("dayjs")

const Cache = (function () {
  const TIME_TO_LIVE_IN_SECONDS = 60
  const entries = new Map()
  function clearCache() {
    entries.clear()
  }
  function findRequest(url) {
    const request = entries.get(url)
    if (!request) {
      return null
    }
    if (
      dayjs().isBefore(
        request.getCreatedAt().add(TIME_TO_LIVE_IN_SECONDS, "second")
      )
    ) {
      return request
    }
    // remove from cache, TTL has passed
    entries.delete(url)
    return null
  }
  function setRequest(url, request) {
    entries.set(url, request)
  }
  return { clearCache, findRequest, setRequest }
})()

module.exports = { Cache }
