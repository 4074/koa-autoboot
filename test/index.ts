import Koa from 'koa'
import KoaAutoboot from '../src/index'

const app = new Koa()
app.use(
  KoaAutoboot({
    dir: __dirname,
    prefix: 'api'
  })
)

app.listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log('App listening on 4000')
})
