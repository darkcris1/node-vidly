const request = require('supertest')
const { Genre } = require('../../models/genres')
const { User } = require('../../models/users')

let server

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../index')
  })
  afterEach(async () => {
    server.close()
    await Genre.deleteMany({})
  })

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.insertMany([{ name: 'genre1' }, { name: 'genre2' }])
      const res = await request(server).get('/api/genres/')
      expect(res.status).toBe(200)
    })
  })
  describe('GET /:id', () => {
    it('should return the genre if the id is valid', async () => {
      const genre = new Genre({ name: 'genre' })
      await genre.save()
      const res = await request(server).get('/api/genres/' + genre._id)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', genre.name)
    })
    it('should return 404 if the id is not found', async () => {
      const res = await request(server).get(
        '/api/genres/5fdc9425ba87ba1910a8f406',
      )
      expect(res.status).toBe(404)
    })
  })

  describe('POST /', () => {
    let name, token
    const exec = async () => {
      return await request(server)
        .post('/api/genres/')
        .set('x-auth-token', token)
        .send({ name })
    }

    beforeEach(() => {
      token = new User().generateToken()
      name = 'genre1'
    })
    it('should return 401 if the there is no user logged in', async () => {
      token = ''
      console.log(process.env.NODE_ENV)
      const res = await exec()
      expect(res.status).toBe(401)
    })
    it('should return 400 if the input is less than 5 characters', async () => {
      name = '123'
      const res = await exec()
      expect(res.status).toBe(400)
    })
    it('should return 400 if thein put is more than 50 characters', async () => {
      name = Array(52).join('d')
      const res = await exec()
      expect(res.status).toBe(400)
    })
    it('should save the the genre if input is valid', async () => {
      await exec()
      const genre = await Genre.find({ name: 'genre1' })
      expect(genre).not.toBeNull()
    })
    it('should return the genre if input is valid', async () => {
      const res = await exec()
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('name')
    })
  })
})
