const express = require('express')
const { Movie, validate } = require('../models/movies')
const { Genre } = require('../models/genres')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', async (req, res) => {

  const movies = await Movie.find()
  res.send(movies)

})

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  if (!movie) return res.status(404).send('Movie not found')

  res.send(movie)
})

router.delete('/:id', auth, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id)
  if (!movie) return res.status(404).send('Movie not found')

  res.send(movie)

})

// ROuter with request input or body

router.post('/', auth, async (req, res) => {
  const errorMsg = validate(req.body)
  if (errorMsg) return res.status(400).send(errorMsg)

  const genre = await Genre.findById(req.body.genreID)
  req.body.genreID = undefined
  const newMovie = new Movie({
    ...req.body,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
  })
  const result = await newMovie.save()
  res.send(result)
})

router.put('/:id', auth, async (req, res) => {
  const errorMsg = validate(req.body)

  if (errorMsg) return res.status(400).send(errorMsg)

  const updatedMovie = await Movie.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  )
  res.send(updatedMovie)
})


module.exports = router
