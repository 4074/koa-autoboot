import Koa from 'koa'
import compose from 'koa-compose'
import parser, { RouteFinalOption } from './parser'
import ReturnMiddleware from './middlewares/ReturnMiddleware'
import LogMiddleware, { logger, LoggerHandle } from './middlewares/LogMiddleware'

export { Controller, Middleware, Get, Post, Route } from './decorators/route'
export { Inject, Ctx, Body, Query, RequestFile, Session } from './decorators/inject'

export interface KoaAutobootOptions {
  dir: string
  prefix?: string,
  returnParser?: (value: any) => any
  onRequest?: LoggerHandle
}

export default function autoboot(options: KoaAutobootOptions, callback?: CallableFunction): Koa.Middleware {
  let routes: RouteFinalOption[] = []
  const { dir, prefix, returnParser, onRequest } = options
  const defaultMiddlewares = [LogMiddleware(), ReturnMiddleware(returnParser)]

  parser(dir, prefix)
    .then((r) => {
      routes = r
      callback?.()
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err)
    })

  // Add log listeners
  if (typeof onRequest === 'function') {
    logger.on('in', onRequest)
    logger.on('out', onRequest)
  }

  return async (ctx: Koa.Context, next: () => any): Promise<any> => {
    for (const { method, regexp, middlewares } of routes) {
      if (ctx.method === method && regexp.test(ctx.path)) {
        return compose([...defaultMiddlewares, ...middlewares])(ctx, next)
      }
    }
    return next()
  }
}
