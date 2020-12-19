const jm = require('json-msg')
const mongoose = require('mongoose')
const { genreSchema } = require('./genres')

const Movie = mongoose.model(
  'Movie',
  new mongoose.Schema({
    dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
    numberInStock: { type: Number, required: true, min: 0, max: 255 },
    title: { type: String, required: true, minlength: 0, maxlength: 255 },
    genre: { type: genreSchema, required: true },
  }),
)
// Destructure the types of json-msg
const { str, num } = jm

function validateMovies(data) {
  const schema = {
    title: str({ min: 4, max: 50 }),
    dailyRentalRate: num({ min: 0 }),
    numberInStock: num({ min: 0 }),
    genreID: jm.objectID(),
  }
  return jm.validate(data, schema)
}

exports.Movie = Movie
exports.validate = validateMovies
