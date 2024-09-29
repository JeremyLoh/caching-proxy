class ClearCacheCommand {
  constructor(cache) {
    this.cache = cache
  }

  async execute() {
    // TODO clear cache of server (singleton)
  }
}

module.exports = { ClearCacheCommand }
