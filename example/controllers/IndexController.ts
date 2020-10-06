/* eslint-disable class-methods-use-this */
import Koa from 'koa'
import { Controller, Get } from '../../src/index'

@Controller('/')
export default class IndexController {
  @Get()
  async greeting(ctx: Koa.Context): Promise<void> {
    ctx.body = 'Hello world'
  }
}
