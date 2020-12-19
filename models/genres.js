const jm = require('json-msg')
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
})
const Genre = mongoose.model('Genre', genreSchema)

const { str } = jm

function validateGenre(data) {
  const schema = {
    name: str({ min: 5, max: 50 }),
  }
  return jm.validate(data, schema)
}
exports.genreSchema = genreSchema
exports.Genre = Genre
exports.validate = validateGenre
