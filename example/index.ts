import path from 'path'
import Koa from 'koa'
import KoaAutoboot from '../src/index'

const app = new Koa()
app.use(KoaAutoboot({ dir: path.join(__dirname, 'controllers') }))

app.listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log('App listening on 4000')
})
