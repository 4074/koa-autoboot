import Koa from 'koa'
import parser, { Route } from './parser'

export { Controller, Middleware, Get, Post, Route } from './decorators/route'

export interface KoaAutobootOptions {
  dir: string
  prefix?: string
}

export default function autoboot(options: KoaAutobootOptions): Koa.Middleware {
  let routes: Route[] = []
  parser(options.dir, options.prefix)
    .then((r) => {
      routes = r
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err)
    })

  return async (ctx: Koa.Context, next: () => any): Promise<any> => {
    for (const { method, regexp, handler, middlewares } of routes) {
      if (ctx.method === method && regexp.test(ctx.path)) {
        for (const m of middlewares) {
          // TODO: pass a real next funciton
          // eslint-disable-next-line no-await-in-loop
          await m(ctx, async () => {
            /**/
          })
        }
        // eslint-disable-next-line no-await-in-loop
        return handler(ctx, next)
      }
    }
    await next()
  }
}
