/* eslint-disable class-methods-use-this */
import Koa from 'koa'
import { Controller, Get, Post, Middleware } from '../src/index'
import AliceMiddleware from './AliceMiddleware'

@Controller('/')
export default class MainController {
  @Get('/')
  async index(ctx: Koa.Context): Promise<void> {
    ctx.body = 'Index'
  }

  @Middleware(AliceMiddleware())
  @Get()
  async hello(ctx: Koa.Context): Promise<void> {
    ctx.body = 'Hello world'
  }

  @Post()
  async post(ctx: Koa.Context): Promise<void> {
    ctx.body = 'Post'
  }
}
