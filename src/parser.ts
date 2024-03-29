import fs from 'fs'
import Koa from 'koa'
import path from 'path'
import { pathToRegexp } from 'path-to-regexp'
import { KoaAutobootOptions } from 'src'
import { CONTROLLER_KEY, INJECT_KEY, MIDDLEWARE_KEY, ROUTE_KEY } from './consts'
import { RouteOption } from './decorators/route'

export interface RouteFinalOption extends RouteOption {
  regexp: RegExp
  middlewares: Koa.Middleware[]
}

function getRoutesFormClass(
  ControllerClass: any,
  prefix: string
): RouteFinalOption[] {
  const routes = []
  const controller = new ControllerClass()
  const proto = ControllerClass.prototype

  const controllerMiddlewares = ControllerClass[MIDDLEWARE_KEY] || []

  for (const methodName of Object.getOwnPropertyNames(proto)) {
    const handler = controller[methodName]
    if (!handler[ROUTE_KEY]) continue

    const middlewares = controllerMiddlewares.concat(
      handler[MIDDLEWARE_KEY] || []
    )
    const injects = handler[INJECT_KEY] || []

    for (const option of handler[ROUTE_KEY]) {
      const finalPath = path
        .join('/', prefix, option.path)
        .replace(/\/$/, '')
        .replace(/\\/g, '/')

      routes.push({
        regexp: pathToRegexp(finalPath),
        path: finalPath,
        method: option.method,
        middlewares: [...middlewares, injectHandler(handler, injects)]
      })

      // eslint-disable-next-line no-console
      console.log(
        `Route: ${option.method} ${finalPath}${middlewares.length > 0
          ? ` [${middlewares.map((m: CallableFunction) => m.name).join(',')}]`
          : ''
        }`
      )
    }
  }

  return routes
}

function injectHandler(handler, injects: CallableFunction[]) {
  return async (ctx: Koa.Context) => {
    const injectValues = injects.map((fn) => fn(ctx))
    return handler(...injectValues)
  }
}

const isMatchIgnore = (file: string, ignore: KoaAutobootOptions['ignore']) => {
  if (ignore) {
    if (Array.isArray(ignore)) {
      for (const ig of ignore) {
        if (typeof ig === 'string') {
          if (ig === file) return true
        } else {
          if (ig.test(file)) return true
        }
      }
    } else if (typeof ignore === 'function') {
      return ignore(file)
    }
  }
  return false
}

export default async function parser(
  folderPath: string,
  prefix = '',
  ignore: KoaAutobootOptions['ignore']
): Promise<RouteFinalOption[]> {
  const files = fs.readdirSync(folderPath)
  let allRoutes = []

  // eslint-disable-next-line no-console
  console.log('Loading controllers...')
  const promises = []

  for (const file of files) {
    if (!/\.(j|t)s$/.test(file) || /\.d.ts$/.test(file) || isMatchIgnore(file, ignore)) continue

    const promise = import(path.join(folderPath, file)).then((exported) => {
      const ControllerClass = exported.default
      const controllerPath = ControllerClass?.[CONTROLLER_KEY]

      if (typeof ControllerClass === 'function' && controllerPath) {
        // eslint-disable-next-line no-console
        console.log('Load', file, `for path ${ControllerClass[CONTROLLER_KEY]}`)
        const routes = getRoutesFormClass(
          ControllerClass,
          path.join(prefix, controllerPath)
        )
        allRoutes = allRoutes.concat(routes)
      }
    })
    promises.push(promise)
  }

  await Promise.all(promises)

  return allRoutes
}
