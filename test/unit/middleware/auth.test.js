const mongoose = require('mongoose')
const auth = require('../../../middleware/auth')
const { User } = require('../../../models/users')
require('dotenv').config()
describe('auth middleware', () => {
  it('should populate the req.user with payload of a valid JWT', () => {
    const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
    const token = new User(user).generateToken()
    const req = {
      header: jest.fn().mockReturnValue(token),
    }
    const res = {}
    const next = jest.fn()
    auth(req, res, next)
    console.log(req.user, user)
    expect(req.user).toMatchObject(user)
  })
})
