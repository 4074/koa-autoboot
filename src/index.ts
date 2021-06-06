import Koa from 'koa'
import Router from './router'
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

type AnyFunction = (...args: any[]) => any

export default function autoboot(options: KoaAutobootOptions, callback?: AnyFunction): Koa.Middleware {
  const { dir, prefix, returnParser, onRequest } = options
  const middlewares = [LogMiddleware(), ReturnMiddleware(returnParser)]

  // Load all controller files.
  const router = new Router(middlewares)
  router.load(dir, prefix).then(callback)

  // Add log listeners
  if (typeof onRequest === 'function') {
    logger.on('in', onRequest)
    logger.on('out', onRequest)
  }

  // Resolve the requests.
  return router.resolve
}
