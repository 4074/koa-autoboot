import Koa from 'koa'
import KoaRouter from 'koa-router'
import KoaBoot from '../src/index'

const router = new KoaRouter({ prefix: '/api' })

KoaBoot(__dirname, new Koa(), router).then((app) => {
  app.listen(4000, () => {
    // eslint-disable-next-line no-console
    console.log('App listening on 4000')
  })
})
