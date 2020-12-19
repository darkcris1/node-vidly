const request = require('supertest')
const { User } = require('../../models/users')
const { Genre } = require('../../models/genres')

let server

describe('Auth middleware', () => {
  beforeEach(() => {
    server = require('../../index')
  })
  afterEach(async () => {
    await Genre.deleteMany({})
    server.close()
  })
  let token
  const exec = () => {
    return request(server)
      .post('/api/genres/')
      .set('x-auth-token', token)
      .send({ name: 'Thriller' })
  }

  beforeEach(() => {
    token = new User().generateToken()
  })
  it('should return 401 if no token is provided', async () => {
    token = ''
    const res = await exec()
    expect(res.status).toBe(401)
  })
  it('should return 400 if token is invalid', async () => {
    token = '123'
    const res = await exec()
    expect(res.status).toBe(400)
  })
  it('should return 400 if token is invalid', async () => {
    const res = await exec()
    expect(res.status).toBe(200)
  })
})
