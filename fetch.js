const fetch = require("@apicase/adapter-fetch")
const fluent = require("schematic-fluent")

const setOrMerge = key => ctx => (...args) => ({
  [key]:
    typeof args[0] === "object"
      ? { ...ctx[key], ...args[0] }
      : { ...ctx[key], [args[0]]: args[1] }
})

const setProp = key => ctx => value => ({ [key]: value })

const setMethod = method => () => url => ({ method, url })

const fetchSchema = fluent({
  methods: {
    url: setProp("url"),
    get: setMethod("get"),
    put: setMethod("put"),
    body: setProp("body"),
    post: setMethod("post"),
    patch: setMethod("patch"),
    param: setOrMerge("param"),
    query: setOrMerge("query"),
    delete: setMethod("delete"),
    method: setProp("method"),
    params: setOrMerge("params")
  },
  executors: {
    getPayload: payload => () => payload
  }
})({ adapter: fetch })

module.exports = fetchSchema
