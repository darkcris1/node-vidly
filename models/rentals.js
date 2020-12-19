const jm = require('json-msg')
const mongoose = require('mongoose')

const Rental = mongoose.model(
  'Rental',
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        phone: { type: String, required: true, minlength: 4 },
        name: { type: String, required: true },
        isGold: { type: Boolean, default: false },
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
        title: { type: String, required: true, minlength: 0, maxlength: 255 },
      }),
      required: true,
    },
    dateOut: { type: Date, required: true, default: Date.now() },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 },
  }),
)
// Destructure the types of json-msg

function validateRentals(data) {
  const schema = {
    customerID: jm.objectID(), // cusotm messages for custom Object
    movieID: jm.objectID(),
  }
  return jm.validate(data, schema)
}

exports.Rental = Rental
exports.validate = validateRentals
