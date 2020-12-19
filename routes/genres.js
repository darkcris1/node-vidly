const express = require('express')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')
const auth = require('../middleware/auth')
const { Genre, validate } = require('../models/genres')

const router = express.Router()

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name')
  res.send(genres)
})

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id)
  if (!genre) return res.status(404).send('Genre not found')

  res.send(genre)
})

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id)
  if (!genre) return res.status(404).send('Genre not found')

  res.send(genre)
})

router.post('/', auth, async (req, res) => {
  const errorMsg = validate(req.body)
  if (errorMsg) return res.status(400).send(errorMsg)

  const newGenre = new Genre(req.body)
  const result = await newGenre.save()
  res.send(result)
})

router.put('/:id', async (req, res) => {
  const errorMsg = validate(req.body)

  if (errorMsg) return res.status(400).send(errorMsg)

  const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  res.send(updatedGenre)
})

module.exports = router
