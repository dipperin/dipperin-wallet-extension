import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'
import has from 'lodash/has'

export const requestHandle = <T extends object>(object: T): T => {
  return new Proxy<T>(object, {
    get(target, prop) {
      if (!Reflect.has(target, prop)) {
        throw new Error(`Object does not have property '${prop.toString()}'`)
      }

      if (!isFunction(Reflect.get(target, prop)) || prop === 'on') {
        return Reflect.get(target, prop)
      }

      return (...args: any[]) => {
        if (args.length === 0) {
          args[0] = {}
        }

        const [firstArg] = args

        const { resolve = () => null, reject = (ex: any) => console.error(ex), data } = firstArg

        if (!isObject(firstArg) || !has(firstArg, 'data')) {
          return Reflect.get(target, prop).call(target, ...args)
        }

        Promise.resolve(Reflect.get(target, prop).call(target, data))
          .then(resolve)
          .catch(reject)
      }
    }
  })
}
