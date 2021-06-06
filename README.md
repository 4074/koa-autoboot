# Koa Autoboot

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage][codecov-image]][codecov-url]

Auto bootstrap routes from a controller folder.

- Auto build routes from controller files
- Use the return value as response body
- Inject `ctx`, `body`, `query` or custom data
- Build-in validator for `body` and `query` base on [`fastest-validator`](https://github.com/icebob/fastest-validator)
- Log request in and out

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
  @Ctx() // Inject the `ctx` as the argument.
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

KoaAutoboot(
  // The options
  {
    // string, the folder of controller files
    dir: __dirname,

    // string (optional), the prefix append to all routes path
    prefix: 'api',

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
    },
  },
)

interface GreetingParams {
  name: string
}

/**
 * Mark the class is a router.
 * Pass a router path (optional), the default values is className.toLowerCase().replace('controller', '')
 * For this class, the default router path is `index`
 */
@Controller('/')
// Add koa middlewares to the router.
@Middleware([cors()])
export default class IndexController {
  // Add koa middlewares to a route.
  @Middleware([cors()])

  // Add a `POST` route, pass the path (optional), default is the method name.
  @Post()

  // Add a route, pass the http methods, default is `['GET', 'POST']`.
  @Route(['PUT'])

  // Inject the `ctx.request.body` as the argument, pass the validate schema (optional)
  @Body({ name: 'string' })

  // Inject the `ctx.request.query` as the argument
  @Query()

  // Inject the `ctx` as the argument
  @Ctx()
  async greeting(ctx: Koa.Context, query: any, body: GreetingParams): Promise<string> {
    // Use return value as the response
    return `Hello, ${body.name}`
  }
}
```

## Development

```sh
npm install
npm start
```

Will run the example koa server with nodemon.

[npm-image]: https://img.shields.io/npm/v/koa-autoboot?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa-autoboot
[travis-image]: https://img.shields.io/travis/com/4074/koa-autoboot?style=flat-square
[travis-url]: https://travis-ci.com/4074/koa-autoboot
[codecov-image]: https://img.shields.io/codecov/c/github/4074/koa-autoboot.svg?style=flat-square
[codecov-url]: https://app.codecov.io/gh/4074/koa-autoboot?branch=main
