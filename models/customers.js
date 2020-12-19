const jm = require('json-msg')
const mongoose = require('mongoose')

const Customer = mongoose.model(
  'Customers',
  new mongoose.Schema({
    phone: { type: String, required: true, minlength: 4 },
    name: { type: String, required: true },
    isGold: { type: Boolean, default: false },
  }),
)
// Destructure the types of json-msg
const { str, bool } = jm

function validateCustomer(data) {
  const schema = {
    name: str({ min: 2 }),
    phone: str({ min: 4 }),
    isGold: bool({ required: false }),
  }
  return jm.validate(data, schema)
}

exports.Customer = Customer
exports.validate = validateCustomer
