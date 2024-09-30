class ClearCacheCommand {
  constructor(cache) {
    this.cache = cache
  }

  async execute() {
    this.cache.clearCache()
    console.log("Cleared Cache")
  }
}

module.exports = { ClearCacheCommand }
