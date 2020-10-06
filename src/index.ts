import Koa from 'koa'
import compose from 'koa-compose'
import parser, { RouteFinalOption } from './parser'

export { Controller, Middleware, Get, Post, Route } from './decorators/route'

export interface KoaAutobootOptions {
  dir: string
  prefix?: string
}

export default function autoboot(options: KoaAutobootOptions): Koa.Middleware {
  let routes: RouteFinalOption[] = []
  parser(options.dir, options.prefix)
    .then((r) => {
      routes = r
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err)
    })

  return async (ctx: Koa.Context, next: () => any): Promise<any> => {
    for (const { method, regexp, middlewares } of routes) {
      if (ctx.method === method && regexp.test(ctx.path)) {
        return compose(middlewares)(ctx, next)
      }
    }
    return next()
  }
}
