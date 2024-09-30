# caching-proxy

Caches responses from other servers

CLI tool that starts a caching proxy server, it will forward requests to the actual server and cache the responses.
If the same request is made again, it will return the cached response instead of forwarding the request to the server

Cache entries will be cleared if Time to Live is exceeded.
Cache eviction strategy used is TTL (Time to live)

- https://redis.io/blog/cache-eviction-strategies/

# Requirements

User should be able to start the caching proxy server by running a command like the following:

```shell
caching-proxy --port <number> --origin <url>
```

- `--port` is the port on which the caching proxy server will run
- `--origin` is the URL of the server to which the requests will be forwarded

For example, if the user runs the following command:

```shell
caching-proxy --port 3000 --origin http://dummyjson.com
```

The caching proxy server should start on port 3000 and forward requests to `http://dummyjson.com`

- If the user then makes a request to `http://localhost:3000/products`, the caching proxy server should forward the request to `http://dummyjson.com/products`, return the response along with headers and cache the response. Also, add the headers to the response that indicate whether the response is from the cache or the server

```
# If the response is from the cache
X-Cache: HIT

# If the response is from the origin server
X-Cache: MISS
```

If the same request is made again, the caching proxy server should return the cached response instead of forwardning the request to the server

You should also provide a way to clear the cache by running a command like the following:

```shell
caching-proxy --clear-cache
```

# Example Usage

```
# To start the server on port 3000 to have proxy to origin "https://jsonplaceholder.typicode.com"
--port 3000 --origin https://jsonplaceholder.typicode.com

In a browser, visit => http://localhost:3000/todos/1
The response of https://jsonplaceholder.typicode.com/todos/1 will be displayed and cached
```

# References

- https://www.prisma.io/dataguide/managing-databases/introduction-database-caching
- Prevent HTTP response of proxy sent to user ERR_CONTENT_DECODING_FAILED. Remove the "Content-Encoding" or "content-encoding" header from server response
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
  - https://stackoverflow.com/questions/40683850/apache-proxying-leads-to-err-content-decoding-failed-error
