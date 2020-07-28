/* eslint-disable no-param-reassign */
import { Middleware as IMiddleware } from 'koa'

export type HTTPMethod = 'GET' | 'POST'

export interface ClassDecorator {
  (target: NewableFunction): void
}

export interface MethodDecorator {
  (
    target: Record<string, any>,
    key: string,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any>
}

export const ROUTER_KEY = Symbol('Router')
export const MIDDLEWARE_KEY = Symbol('Middleware')
export const ROUTE_KEY = Symbol('Route')

function getRouterNameFromClass(target: NewableFunction): string {
  return target.name.toLowerCase().replace(/controller$/, '')
}

export function Router(path?: string): ClassDecorator {
  return (target) => {
    target[ROUTER_KEY] = path || getRouterNameFromClass(target)
  }
}

export function Middleware(
  middleware: IMiddleware | IMiddleware[]
): MethodDecorator {
  const ms = Array.isArray(middleware) ? middleware : [middleware]
  return (target, key, descriptor) => {
    descriptor.value[MIDDLEWARE_KEY] = [
      ...ms,
      ...(descriptor.value[MIDDLEWARE_KEY] || [])
    ]
    return descriptor
  }
}

export function Route(
  method: HTTPMethod | HTTPMethod[] = ['GET', 'POST'],
  path?: string
): MethodDecorator {
  return (target, key, descriptor) => {
    const options = {
      path: path || key,
      method: Array.isArray(method) ? method : [method]
    }

    if (!descriptor.value[ROUTE_KEY]) descriptor.value[ROUTE_KEY] = []
    descriptor.value[ROUTE_KEY].push(options)

    return descriptor
  }
}

export function Get(path?: string): MethodDecorator {
  return Route('GET', path)
}

export function Post(path?: string): MethodDecorator {
  return Route('POST', path)
}
