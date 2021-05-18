import server from '../example/server'
import { KoaAutobootOptions } from '../src'

const port = 4040

export default class Server {
  public host: string

  private closer: (() => void) | undefined

  private options: Partial<KoaAutobootOptions>

  public constructor(options: Partial<KoaAutobootOptions> = { onRequest: () => { } }) {
    this.options = options
    this.host = `http://localhost:${port}`
  }

  public start = async () => {
    this.closer = await server(port, this.options)
  }

  public close = () => this.closer?.()
}
