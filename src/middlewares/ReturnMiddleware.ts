import Koa from 'koa'

type ReturnBodyParser = (value: any) => any

export const defaultParser = (value: any) => {
  const body = { status: true, message: 'Success', data: null }

  if (value === false || value instanceof Error) {
    body.status = false
    body.message = value.message || 'Fail'
  } else {
    body.data = value
  }

  return body
}

export default function middleware(parser: ReturnBodyParser = defaultParser): Koa.Middleware {
  return async (ctx: Koa.Context, next: () => any): Promise<any> => {
    const result = await next()
    if (result === undefined) return
    ctx.body = parser(result)
  }
}
