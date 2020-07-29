import Koa from 'koa'
import KoaRouter from 'koa-router'
import parser from './parser'

export { Controller, Middleware, Get, Post, Route } from './decorators/route'

export default async function(controllerPath: string, app: Koa, router?: KoaRouter): Promise<Koa> {
  const koaApp = app || new Koa()
  const koaRouter = router || new KoaRouter()

  const routes = await parser(controllerPath)
  for (const [routePath, route] of Object.entries(routes)) {
    koaRouter.use(routePath, route.routes(), route.allowedMethods())
  }
  koaApp.use(koaRouter.routes())

  return koaApp
}