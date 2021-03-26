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

export type ClassDecorator = (target: NewableFunction) => void

export type MethodDecorator = (
  target: Record<string, any>,
  key: string,
  descriptor: TypedPropertyDescriptor<any>
) => TypedPropertyDescriptor<any>

function getControllerPathFromClass(target: NewableFunction): string {
  return target.name.toLowerCase().replace(/controller$/, '')
}

export function Controller(path?: string): ClassDecorator {
  return (target) => {
    target[CONTROLLER_KEY] = path || getControllerPathFromClass(target)
  }
}

export function Middleware(
  middleware: Koa.Middleware | Koa.Middleware[]
): MethodDecorator {
  return (target, key, descriptor) => {
    let middlewares = Array.isArray(middleware) ? middleware : [middleware]
    if (descriptor.value[MIDDLEWARE_KEY])
      middlewares = middlewares.concat(descriptor.value[MIDDLEWARE_KEY])

    descriptor.value[MIDDLEWARE_KEY] = middlewares

    return descriptor
  }
}

export function Route(
  method: HTTPMethod | HTTPMethod[] = ['GET', 'POST'],
  path?: string
): MethodDecorator {
  return (target, key, descriptor) => {
    const methods = Array.isArray(method) ? method : [method]
    const options: RouteOption[] = methods.map((m) => ({
      method: m,
      path: path || key
    }))

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
