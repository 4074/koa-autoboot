/* eslint-disable class-methods-use-this */
import Koa from 'koa'
import { Controller, Get, Post } from '../src/index'

@Controller('/')
export default class MainController {
  @Get('/')
  async index(ctx: Koa.Context): Promise<void> {
    ctx.body = 'Index'
  }

  @Get()
  async hello(ctx: Koa.Context): Promise<void> {
    ctx.body = 'Hello world'
  }

  @Post()
  async post(ctx: Koa.Context): Promise<void> {
    ctx.body = 'Post'
  }
}
