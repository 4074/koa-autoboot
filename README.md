# Koa Autoboot

Auto bootstrap routes from a controller folder.

- Auto build routes from controller files
- Use the return value as response body
- Inject `ctx`, `body`, `query` or custom data
- Build-in validator for `body` and `query` base on [`fastest-validator`](https://github.com/icebob/fastest-validator)

## Usage

Install

```sh
npm install koa-autoboot koa-body
```

Basic usage

```ts
// controllers/IndexController.ts
import Koa from 'koa'
import { Controller, Get, Ctx } from 'koa-autoboot'

@Controller('/')
export default class IndexController {
  @Get()
  @Ctx() // Inject the `ctx.request.body` as the argument.
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
app.use(
  KoaAutoboot({
    dir: path.join(__dirname, 'controllers'),
  }),
)
app.listen(4000)
```

`curl http://localhost:4000/greeting` will get `Hello world`.

## APIs

```ts
import KoaAutoboot, { Controller, Post, Route, Middleware, Body } from 'koa-autoboot'

KoaAutoboot({
  dir: __dirname   // string, the folder of controller files
  prefix: 'api'    // string (optional), the prefix append to all routes path
  // function (optional), parse return value to response body.
  // If return value is `undefined`, parser will not be call.
  // Default parser:
  returnParser: (value: any) => {
    const body = { status: true, message: 'Success', data: null }

    if (value === false || value instanceof Error) {
      body.status = false
      body.message = value.message || 'Fail'
    } else {
      body.data = value
    }

    return body
  }
})

interface GreetingParams {
  name: string
}

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
  @Post()                 // Add a `POST` route, pass the path (optional), default is the method name.
  @Route(['PUT'])         // Add a route, pass the http methods, default is `['GET', 'POST']`.
  @Body()                 // Inject the `ctx.request.body` as the argument, pass the validate schema (optional)
  async greeting(params: GreetingParams): Promise<string> {
    // Use return value to response feature
    return `Hello, ${params.name}`
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
