import Koa from 'koa'

type ReturnBodyParser = (value: any) => any

const defaultParser = (value: any) => {
  const body = { status: true, message: '操作成功', data: null }

  if (value === false || value instanceof Error) {
    body.status = false
    body.message = value.message || '操作失败'
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
