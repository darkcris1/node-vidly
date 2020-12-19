const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User, validate } = require('../models/users')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id, '-password -__v')
  if (!user) return res.status(400).send('Bad Request')
  res.send(user)
})

router.post('/', async (req, res) => {
  const errorMsg = validate(req.body)
  if (errorMsg) return res.status(400).send(errorMsg)

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send({ message: 'Email already registered' })

  user = new User(_.pick(req.body, ['email', 'name', 'password']))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  res
    .header('x-auth-token', user.generateToken())
    .send(_.pick(user, ['email', 'name', '_id']))
})

module.exports = router
