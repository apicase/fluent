const fluentApicase = schema => {
  const extended = schema.extend({
    immutable: true,
    methods: {
      on: ({ service }) => (evt, cb) => {
        if (process.env.NODE_ENV === "development" && !service) {
          throw new ReferenceError(
            "[@apicase/fluent.on] You have to pass service before adding events. If you have services to pass you can write .service(new ApiService)"
          )
        }
        service.on(evt, cb)
        return {}
      },

      hook: ({ hooks }) => (hookType, cb) => ({
        hooks: {
          ...hooks,
          [hookType]: hooks[hookType]
            ? hooks[hookType].concat([cb])
            : Array.isArray(cb)
              ? cb
              : [cb]
        }
      }),

      meta: ({ meta }) => (...args) => ({
        meta:
          typeof args[0] === "object"
            ? { ...meta, ...args[0] }
            : { ...meta, [args[0]]: args[1] }
      }),

      hooks: ({ hooks }) => newHooks =>
        Object.entries(newHooks).reduce((res, [hookType, hooks]) => {
          res[hookType] = (res[hookType] || []).concat(hooks)
          return res
        }, hooks),

      adapter: () => adapter => ({ adapter }),

      service: () => service => ({ service })
    },
    executors: {,
      getPayload: payload => () => payload,

      getService: ({ service, ...payload }) => service.extend(payload),

      doRequest: ({ service, ...payload }) => service.doRequest(payload),

      pushRequest: ({ service, ...payload }) => service.pushRequest(payload),

      doSingleRequest: ({ service, ...payload }) =>
        service.doSingleRequest(payload),

      doUniqueRequest: ({ service, ...payload }) =>
        service.doUniqueRequest(payload)
    },
    defaults: () => ({
      hooks: {}
    })
  })

  return typeof extended === "function" ? extended() : extended
}

module.exports = fluentApicase
