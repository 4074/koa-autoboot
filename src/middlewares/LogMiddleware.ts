/* eslint-disable no-console */
import Koa from 'koa'
import EventEmitter from 'events'

export interface Logger {
  emitter: EventEmitter
  on: (type: 'in' | 'out', handle: LoggerHandle) => void
  once: (type: 'in' | 'out', handle: LoggerHandle) => void
  off: (type: 'in' | 'out', handle: LoggerHandle) => void
}

export type LoggerHandle = (info: LogInfo, ctx: Koa.Context) => void

export interface LogInfo {
  host: string
  path: string
  referer: string
  query: Record<string, any>
  body: any
  ip: string
  userAgent: string
  stage: 'in' | 'out'
  date: Date
  duration?: number
  status?: number
  error?: string
}

const emitter = new EventEmitter()

export const logger: Logger = {
  emitter,
  on: emitter.on.bind(emitter),
  once: emitter.once.bind(emitter),
  off: emitter.off.bind(emitter)
}

export default function middleware(): Koa.Middleware {
  return async function m(
    ctx: Koa.Context,
    next: () => Promise<any>
  ): Promise<void> {

    // Create and emit `in` log
    const info: LogInfo = {
      host: ctx.host,
      path: ctx.path,
      query: (ctx.request as any).query,
      body: (ctx.request as any).body,
      referer: ctx.header.referer,
      ip: ctx.ip,
      userAgent: ctx.header['user-agent'],
      stage: 'in',
      date: new Date()
    }
    emitter.emit('in', { ...info }, ctx)

    let error: any
    try {
      await next()
    } catch (err) {
      error = err
      info.error = error.stack
    }

    // Create and emit `out` log
    info.status = ctx.status
    info.duration = new Date().getTime() - info.date.getTime()
    info.stage = 'out'
    emitter.emit('out', { ...info }, ctx)

    if (error) ctx.throw(error.status || 500, error)
  }
}
