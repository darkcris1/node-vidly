const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User } = require('../models/users')
const jm = require('json-msg')

const router = express.Router()

// Register Post
router.post('/', async (req, res) => {
  const errorMsg = validate(req.body)
  if (errorMsg) return res.status(400).json(errorMsg)

  let user = await User.findOne({ email: req.body.email })
  if (!user)
    return res.status(400).send({ message: 'Invalid email or password' })

  const isValidPassword = await bcrypt.compare(req.body.password, user.password)

  if (!isValidPassword)
    return res.status(400).send({ message: 'Invalid email or password' })
  res.send(user.generateToken())
})

const { str } = jm

function validate(req) {
  const schema = {
    email: str({ email: true }),
    password: str({ alphanum: true, min: 5, max: 30 }),
  }
  return jm.validate(req, schema)
}

module.exports = router
