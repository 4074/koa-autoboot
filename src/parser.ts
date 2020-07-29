import fs from 'fs'
import nodePath from 'path'
import KoaRouter from 'koa-router'
import { CONTROLLER_KEY, MIDDLEWARE_KEY, ROUTE_KEY } from './keys'

export default async function(
  folderPath: string
): Promise<{ [key: string]: KoaRouter }> {
  const files = fs.readdirSync(folderPath)
  const routers = {}

  for (const file of files) {
    if (!/\.(j|t)s$/.test(file)) continue
    // eslint-disable-next-line no-await-in-loop
    const ControllerClass = (await import(`${folderPath}/${file}`)).default

    if (typeof ControllerClass !== 'function' || !ControllerClass[CONTROLLER_KEY]) continue

    const controller = new ControllerClass()
    const proto = ControllerClass.prototype
    const moduleRouter = new KoaRouter()

    // eslint-disable-next-line no-console
    console.log('Auto load controller', file, `for path ${ControllerClass[CONTROLLER_KEY]}`)

    const controllerMiddlewares = ControllerClass[MIDDLEWARE_KEY] || []

    for (const methodName of Object.getOwnPropertyNames(proto)) {
      const fn = controller[methodName]
      if (!fn[ROUTE_KEY]) continue

      const middlewares = controllerMiddlewares.concat(fn[MIDDLEWARE_KEY] || [])

      for (const { path, method } of fn[ROUTE_KEY]) {
        const routerMethod = method.toLowerCase()
        moduleRouter[routerMethod](`${path}`, ...middlewares, fn)
  
        // eslint-disable-next-line no-console
        console.log(
          `route: ${routerMethod} ${ControllerClass[CONTROLLER_KEY]}${path}${
            middlewares.length > 0
              ? ` [${middlewares.map((m) => m.name).join(',')}]`
              : ''
          }`
        )
      }
    }

    routers[ControllerClass[CONTROLLER_KEY]] = moduleRouter
  }

  return routers
}
