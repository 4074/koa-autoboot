import Koa from 'koa'
import compose from 'koa-compose'
import { KoaAutobootOptions } from 'src'
import parser, { RouteFinalOption } from './parser'

export default class Router {
  private routes: RouteFinalOption[] = []
  private cache = new Map()
  private defaultMiddlewares: Koa.Middleware[] = []

  public constructor(middlewares: Koa.Middleware[]) {
    this.defaultMiddlewares = middlewares
  }

  public load = async (dir: string, prefix: string, ignore: KoaAutobootOptions['ignore']) => {
    // Load the controller files.
    return parser(dir, prefix, ignore)
      .then((r) => {
        this.routes = r
      }, (err) => {
        // eslint-disable-next-line no-console
        console.error(err)
      })
  }

  public resolve = async (ctx: Koa.Context, next: () => any): Promise<any> => {
    // Use path cache if existing.
    const pathKey = `[${ctx.method}]${ctx.path.toString()}`
    if (this.cache.has(pathKey)) return this.cache.get(pathKey)(ctx, next)

    for (const { method, regexp, middlewares } of this.routes) {
      if (ctx.method === method && regexp.test(ctx.path)) {

        // Set the cache.
        const key = `[${method}]${regexp.toString()}`
        if (!this.cache.has(key)) this.cache.set(key, compose([...this.defaultMiddlewares, ...middlewares]))
        this.cache.set(pathKey, this.cache.get(key))

        // Use regexp cache.
        return this.cache.get(key)(ctx, next)
      }
    }

    // No matched route.
    return next()
  }
}
