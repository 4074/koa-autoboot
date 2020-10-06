# Koa Autoboot

Auto boot routes from a controller folder.

## Usage

Base usage

```ts
// controllers/IndexController.ts
import Koa from 'koa'
import { Controller, Get } from 'koa-autoboot'

@Controller('/')
export default class IndexController {
  @Get()
  async greeting(ctx: Koa.Context) {
    ctx.body = 'Hello world'
  }
}
```

```ts
// index.ts
import path from 'path'
import Koa from 'koa'

const app = new Koa()
app.use(KoaAutoboot({
  dir: path.join(__dirname, 'controllers')
}))
app.listen(4000)
```

`curl http://localhost:4000/greeting` will get `Hello world`.

## APIs
```ts
import KoaAutoboot, { Controller, Get, Post, Route, Middleware } from 'koa-autoboot'

KoaAutoboot({
  dir: __dirname   // string, the folder of controller files
  prefix: 'api'    // string (optional), the prefix append to all routes path
})

@Controller('/')
/**
 * Mark the class is a router.
 * Pass a router path (optional), the default values is className.toLowerCase().replace('controller', '')
 * For this class, the default router path is `index`
 */
@Middleware([cors()])
/**
 * Add koa middlewares to the router.
 */
export default class IndexController {
  @Middleware([cors()])   // Add koa middlewares to a route.
  @Get('greeting')        // Add a `GET` route, pass the path (optional), default is the method name.
  @Post()                 // Add a `POST` route, pass the path (optional), default is the method name.
  @Route(['PUT'])         // Add a route, pass the http methods, default is `['GET', 'POST']`.
  async greeting(ctx: Koa.Context): Promise<void> {
    ctx.body = 'Hello world'
  }
}
```

Yes, this is all apis.

## Development

```sh
npm install
npm start
```

Will run the example koa server with nodemon.