# Koa Autoboot

Auto boot routes from a controller folder.

## Usage

Base usage

```ts
// controllers/IndexController.ts
import Koa from 'koa'
import { Controller, Get, Post, Middleware } from 'koa-autoboot'

@Controller('/')
export default class IndexController {
  @Get()
  async greeting(ctx: Koa.Context): Promise<void> {
    ctx.body = 'Hello world'
  }
}
```

```ts
// index.ts
import path from 'path'
import Koa from 'koa'

const app = new Koa()
app.use(KoaAutoboot({ dir: path.join(__dirname, 'controllers') }))
app.listen(4000)
```


