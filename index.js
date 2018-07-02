const fluentApicase = schema => {
  const extended = schema.extend({
    immutable: true,
    methods: {
      on: ({ service }) => (evt, cb) => {
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

      service: () => service => ({ service })
    },
    executors: {
      getService: ({ service, ...payload }) => service.extend(payload),

      doRequest: ({ service, ...payload }) => service.doRequest(payload),

      pushRequest: ({ service, ...payload }) => service.pushRequest(payload),

      doSingleRequest: ({ service, ...payload }) =>
        service.doSingleRequest(payload),

      doUniqueRequest: ({ service, ...payload }) =>
        service.doUniqueRequest(payload)
    },
    defaults: () => ({
      hooks: {},
      service: new Object()
    })
  })

  return typeof extended === "function" ? extended() : extended
}

module.exports = fluentApicase
