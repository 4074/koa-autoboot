import path from 'path'
import Koa from 'koa'
import KoaBody from 'koa-body'
import KoaAutoboot, { KoaAutobootOptions } from '../src/index'

export default (port: number, options: Partial<KoaAutobootOptions> = {}): Promise<() => void> => {
  const app = new Koa()
  const realOptions: KoaAutobootOptions = {
    dir: path.join(__dirname, 'controllers'),
    onRequest: (info) => {
      // eslint-disable-next-line no-console
      console.info(info)
    },
    ...options
  }
  app.use(KoaBody({ multipart: true })).use(KoaAutoboot(
    realOptions,
    // eslint-disable-next-line no-console
    () => console.log('Booted!'))
  )

  return new Promise((reslove, reject) => {
    try {
      const server = app.listen(port, () => {
        reslove(() => server.close())
      })
    } catch (error) {
      reject(error)
    }
  })
}
