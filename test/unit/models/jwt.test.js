const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { User } = require('../../../models/users')
require('dotenv').config()
const payload = {
  _id: new mongoose.Types.ObjectId().toHexString(),
  isAdmin: true,
}
const user = new User(payload)
describe('jwt token testing', () => {
  it('should return a valid token and object', () => {
    const token = user.generateToken()
    const decoded = jwt.verify(token, process.env.vidly_jwtPrivateKey)

    expect(decoded).toMatchObject(payload)
  })
})
