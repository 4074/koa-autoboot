import Koa from 'koa'
import { INJECT_KEY } from '../consts'

export function Inject(
  getter: (ctx: Koa) => any
): MethodDecorator {
  return (target, key, descriptor) => {
    if (!descriptor.value[INJECT_KEY]) descriptor.value[INJECT_KEY] = []
    descriptor.value[INJECT_KEY].push(getter)
    return descriptor
  }
}

export function Ctx() {
  return Inject((ctx) => ctx)
}

export function Body() {
  return Inject((ctx) => (ctx.request as any).body)
}

export function Query() {
  return Inject((ctx) => ctx.request.query)
}