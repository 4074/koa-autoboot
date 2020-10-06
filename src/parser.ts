import fs from 'fs'
import Koa from 'koa'
import { pathToRegexp } from 'path-to-regexp'
import { CONTROLLER_KEY, MIDDLEWARE_KEY, ROUTE_KEY } from './consts'

export interface Route {
  regexp: RegExp
  path: string
  method: string
  middlewares: Koa.Middleware[]
}

export default async function parser(
  folderPath: string,
  prefix = ''
): Promise<Route[]> {
  const files = fs.readdirSync(folderPath)
  const routes = []

  // eslint-disable-next-line no-console
  console.log('Loading controllers...')

  for (const file of files) {
    if (!/\.(j|t)s$/.test(file)) continue
    // eslint-disable-next-line no-await-in-loop
    const ControllerClass = (await import(`${folderPath}/${file}`)).default

    if (
      typeof ControllerClass !== 'function' ||
      !ControllerClass[CONTROLLER_KEY]
    )
      continue

    const controller = new ControllerClass()
    const proto = ControllerClass.prototype

    // eslint-disable-next-line no-console
    console.log('Load', file, `for path ${ControllerClass[CONTROLLER_KEY]}`)

    const controllerMiddlewares = ControllerClass[MIDDLEWARE_KEY] || []

    for (const methodName of Object.getOwnPropertyNames(proto)) {
      const handler = controller[methodName]
      if (!handler[ROUTE_KEY]) continue

      const middlewares = controllerMiddlewares.concat(
        handler[MIDDLEWARE_KEY] || []
      )

      for (const { path, method } of handler[ROUTE_KEY]) {
        const finalPath = (prefix ? `/${prefix}/${path}` : path).replace(
          /\/{2}/g,
          '/'
        )

        routes.push({
          regexp: pathToRegexp(finalPath),
          path: finalPath,
          method,
          middlewares: [...middlewares, handler]
        })

        // eslint-disable-next-line no-console
        console.log(
          `Route: ${method} ${finalPath}${
            middlewares.length > 0
              ? ` [${middlewares.map((m) => m.name).join(',')}]`
              : ''
          }`
        )
      }
    }
  }

  // console.log(routes)
  return routes
}
