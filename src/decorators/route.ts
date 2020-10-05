/* eslint-disable no-param-reassign */
import Koa from 'koa'
import { CONTROLLER_KEY, MIDDLEWARE_KEY, ROUTE_KEY } from '../consts'

export type HTTPMethod =
  | 'POST'
  | 'GET'
  | 'PUT'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | 'TRACE'
  | 'CONNECT'
  | 'PATCH'

export interface RouteOption {
  method: HTTPMethod
  path: string
}

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

function getControllerNameFromClass(target: NewableFunction): string {
  return target.name.toLowerCase().replace(/controller$/, '')
}

export function Controller(path?: string): ClassDecorator {
  return (target) => {
    const p = path || getControllerNameFromClass(target)
    target[CONTROLLER_KEY] = /^\//.test(p) ? p : `/${p}`
  }
}

export function Middleware(
  middleware: Koa.Middleware | Koa.Middleware[]
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

function createRouteOptions(
  method: HTTPMethod | HTTPMethod[] = ['GET', 'POST'],
  path?: string
): RouteOption[] {
  const options = []
  if (Array.isArray(method)) {
    for (const m of method) {
      options.concat(createRouteOptions(m, path))
    }
  } else {
    options.push({
      method,
      path: /^\//.test(path) ? path : `/${path}`
    })
  }
  return options
}

export function Route(
  method: HTTPMethod | HTTPMethod[] = ['GET', 'POST'],
  path?: string
): MethodDecorator {
  return (target, key, descriptor) => {
    const options = createRouteOptions(method, path || key)

    if (!descriptor.value[ROUTE_KEY]) descriptor.value[ROUTE_KEY] = []
    for (const op of options) {
      descriptor.value[ROUTE_KEY].push(op)
    }

    return descriptor
  }
}

export function Get(path?: string): MethodDecorator {
  return Route('GET', path)
}

export function Post(path?: string): MethodDecorator {
  return Route('POST', path)
}
