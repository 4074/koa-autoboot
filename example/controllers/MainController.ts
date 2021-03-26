/* eslint-disable class-methods-use-this */
import Koa from 'koa'
import { Controller, Get, Post, Middleware, Ctx, Query, Body, RequestFile } from '../../src/index'
import AliceMiddleware from '../AliceMiddleware'

interface HelloParams {
  name: string
}
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
  @Query<HelloParams>({ name: 'string' })
  public async hello(params: HelloParams): Promise<string> {
    return `Hello ${params.name}`
  }

  @Post()
  @Body<PostParams>({ date: 'number', other: { type: 'string', optional: true } })
  public async post(params: PostParams): Promise<string> {
    return `Post at ${params.date}`
  }

  @Post()
  @Body()
  @RequestFile()
  public async upload(files: { image: File }, body: { foo: string }): Promise<string> {
    return `File uploaded: ${files.image.name}, foo: ${body.foo}`
  }
}
