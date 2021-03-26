/* eslint-disable class-methods-use-this */
import Koa from 'koa'
import { Controller, Get, Post, Middleware, Body, Ctx, Inject } from '../../src/index'
import AliceMiddleware from '../AliceMiddleware'

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
  @Body()
  public async post(body: { date: number }): Promise<string> {
    return `Post at ${body.date}`
  }

  @Post()
  @Body()
  @Inject(ctx => (ctx.request as any).files)
  public async upload(files: { image: File }, body: { foo: string }): Promise<string> {
    return `File uploaded: ${files.image.name}, foo: ${body.foo}`
  }
}
