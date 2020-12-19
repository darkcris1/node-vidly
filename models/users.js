const jm = require('json-msg')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, min: 5, max: 25 },
  password: { type: String, required: true },
  isAdmin: Boolean,
})

userSchema.methods.generateToken = function () {
  const { _id, isAdmin } = this

  return jwt.sign({ _id, isAdmin }, process.env.vidly_jwtPrivateKey)
}
const User = mongoose.model('User', userSchema)
// Destructure the types of json-msg
const { str } = jm

function validateUser(data) {
  const schema = {
    name: str({ min: 2, max: 25 }),
    email: str({ email: true }),
    password: str({ alphanum: true, min: 5, max: 30 }),
  }
  return jm.validate(data, schema)
}

exports.User = User
exports.validate = validateUser
