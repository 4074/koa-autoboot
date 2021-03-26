/* eslint-disable class-methods-use-this */
import { Controller, Get } from '../../src/index'

@Controller('/')
export default class IndexController {
  @Get()
  public async greeting(): Promise<string> {
    return 'Hello world'
  }
}
