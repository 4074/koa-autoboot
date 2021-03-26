/* eslint-disable class-methods-use-this */
import Koa from 'koa'
import { Controller, Get, Post, Middleware, Body, Ctx, Inject } from '../../src/index'
import AliceMiddleware from '../AliceMiddleware'

interface PostParams {
  date: number
  other: string
}

@Controller()
export default class MainController {
  @Get('/')
  @Ctx()
  public async index(ctx: Koa.Context): Promise<void> {
    ctx.body = 'Index'
  }

  @Middleware(AliceMiddleware())
  @Get()
  public async hello(): Promise<string> {
    return 'Hello world'
  }

  @Post()
  @Body<PostParams>({ date: 'number', other: { type: 'string', optional: true } })
  public async post(params: PostParams): Promise<string> {
    return `Post at ${params.date}`
  }

  @Post()
  @Body()
  @Inject(ctx => (ctx.request as any).files)
  public async upload(files: { image: File }, body: { foo: string }): Promise<string> {
    return `File uploaded: ${files.image.name}, foo: ${body.foo}`
  }
}
