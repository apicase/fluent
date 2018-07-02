# @apicase/fluent

Fluent interface for Apicase services

## Benefits

- Like Apicase and unlike another solutions, it's **not API-specific**
- Highly **customizable**. You can easily add your own methods and even whole schemas (based on [schematic-fluent](https://github.com/Kelin2025/schematic-fluent))
- Fluent instance is **immutable** and doesn't modify current instance but returns the new one

## Installation

```bash
npm i @apicase/fluent  # or yarn add @apicase/fluent
# If you're using fetch adapter
npm i @apicase/adapter-fetch
```

## Usage guide

### Create fluent Apicase service

```js
import fetchSchema from "@apicase/fluent/fetch"
import fluentApicase from "@apicase/fluent"
import { ApiService } from "@apicase/services"

// Create fluent instance with fetchSchema
// You can use any service as "base" for requests
const FluentFetch = fluentApicase(fetchSchema).service(new ApiService())

// GET /photos?foo=bar
FluentFetch.get("/photos")
  .query("foo", "bar")
  .doRequest()
  .then(console.log)
```

### Service methods

All `ApiService` methods are available in fluent interface:

```js
FluentFetch.doRequest()
FluentFetch.pushRequest()
FluentFetch.doSingleRequest()
FluentFetch.doUniqueRequest()
```

Also, there are additional methods

```js
FluentFetch.getPayload() // Returns payload
FluentFetch.getService() // Returns service.extend(payload)
```

### Add hooks or events

```js
const addToken = ({ payload, next }) => {
  payload.headers = payload.headers || {}
  payload.headers.token = localStorage.token
  next(payload)
}

const WithAuth = FluentFetch.on("done", console.log).hook("before", addToken)
```

## Available methods

### `apicaseFluent()` methods

`apicaseFluent` function just extends schema with the following methods:
```js
Root
  // Adapter and service
  .adapter(SomeAdapter)
  .service(SomeService)

  // Meta info
  .meta('foo', 'bar')
  .meta({ foo: 'bar' })

  // Listen to events (requires service)
  .on('evtName', cb)

  // Hook or a lot of hooks
  .hook('hookType', cb)
  .hooks({
    done: cb,
    fail: cb
  })
```

### `fetchSchema` methods

To reduce boilerplate code, we provide ready-to-use schema for fetch adapter.  
Fetch schema has the following methods:

```js
Root
  // Request methods + url
  .get("/photos/:id")
  .post("/photos")
  .put("/photos/:id")
  .patch("/photos/:id")
  .delete("/photos/:id")

  // Set URL and method separately
  .url("/foo/bar")
  .method("GET")

  // Query string ?foo=bar
  .query("foo", "bar")
  .query({ foo: "bar" })

  // URL params (e.g. /photos/:id -> /photos/1)
  .param("id", 1)
  .param({ id: 1 })

  // Request headers
  .header("token", "12345")
  .header({ token: "12345" })

  // Body
  .body("something")
  .body(new FormData())
  .body({ foo: "bar" })
```

## Customization

We use [schematic-fluent](https://github.com/Kelin2025/schematic-fluent) for schemas.  
You can check out its README for more info

### Extend schema or instance

```js
import fetchSchema from "@apicase/fluent/fetch"
import apicaseFluent from "@apicase/fluent"

// Extend schema
const jsonApiSchema = fetchSchema.extend({
  methods: {
    include: (ctx, { method }) => include => 
      method("query", { include }),

    page: (ctx, { method }) => (number, limit) =>
      method("query", { page: { number, limit } })
  }
})

const Root = apicaseFluent(jsonApiSchema)

// Extend wrapped service
const GetPost = Root
  .get('/post')
  .extend({
    method: {
      id: (ctx, { method }) => id => method('param', id)
    }
  })

GetPost
  .include(['author'])
  .id(1)
  .doRequest()
  .then(console.log)
```

### Use your own schema

Docs coming soon...
