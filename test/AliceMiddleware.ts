import Koa from 'koa'

export default function HelloMiddleware(): Koa.Middleware {
  return async function hello(ctx: Koa.Context, next: () => any): Promise<any> {
    ctx.res.setHeader('Username', 'Alice')
    return next()
  }
}
