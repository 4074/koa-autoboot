import Koa from 'koa'

export default (): Koa.Middleware => {
  return async function AliceMiddleware(
    ctx: Koa.Context,
    next: () => any
  ): Promise<any> {
    ctx.res.setHeader('Username', 'Alice')
    ctx.body = 'I am Alice. '
    await next()
    ctx.body += '!'
  }
}
