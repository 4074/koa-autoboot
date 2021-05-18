import axios from 'axios'
import Server from './server'
import { defaultParser } from '../src/middlewares/ReturnMiddleware'

const { start, host, close } = new Server()

beforeAll(start)

describe('server', () => {
  it('should return json with `Hello world` on [GET] /greeting', async () => {
    const { data } = await axios.get(`${host}/greeting`)
    expect(data).toMatchObject(defaultParser('Hello world'))
  })

  it('should throw 404 on [POST] /greeting', async () => {
    expect.assertions(2)
    try {
      await axios.post(`${host}/greeting`)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.response.status).toEqual(404)
    }
  })

  it('should return `Index` on [GET] /main', async () => {
    const { data } = await axios.get(`${host}/main/`)
    expect(data).toEqual('Index')
  })

  it('should return json with `Hello Bob` on [GET] /main/hello', async () => {
    const { data } = await axios.get(`${host}/main/hello?name=Bob`)
    expect(data).toEqual('I am Alice. Hello Bob!')
  })

  it('should throw 400 without query on [GET] /main/hello', async () => {
    expect.assertions(3)
    try {
      await axios.get(`${host}/main/hello`)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.response.status).toEqual(400)
      expect(error.response.data).toEqual(`The 'name' field is required, actual: undefined.`)
    }
  })

  it('should return json on [POST] /main/post', async () => {
    const { data } = await axios.post(`${host}/main/post`, { date: 1 })
    expect(data).toMatchObject(defaultParser('Post at 1'))
  })

  it('should throw 400 with string date on [POST] /main/post', async () => {
    expect.assertions(3)
    try {
      await axios.post(`${host}/main/post`, { date: 'a' })
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.response.status).toEqual(400)
      expect(error.response.data).toEqual(`The 'date' field must be a number, actual: a.`)
    }
  })
})

afterAll(() => close())