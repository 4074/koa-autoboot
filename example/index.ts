import path from 'path'
import Koa from 'koa'
import KoaBody from 'koa-body'
import KoaAutoboot from '../src/index'

new Koa().use(KoaBody({ multipart: true })).use(KoaAutoboot(
  { dir: path.join(__dirname, 'controllers') },
  // eslint-disable-next-line no-console
  () => console.log('Booted!'))
).listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log('App listening on 4000')
})
