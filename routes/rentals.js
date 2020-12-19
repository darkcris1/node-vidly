const express = require('express')
const { Rental, validate } = require('../models/rentals')
const { Customer } = require('../models/customers')
const { Movie } = require('../models/movies')
const Transaction = require('mongoose-transactions')
const router = express.Router()
const transaction = new Transaction()
const auth = require('../middleware/auth')


router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut')
  res.send(rentals)

})

router.get('/:id', async (req, res) => {
  const movie = await Rental.findById(req.params.id)
  if (!movie) return res.status(404).send('Rental not found')

  res.send(movie)
})
// ROuter with request input or body

router.post('/', auth, async (req, res) => {
  const errorMsg = validate(req.body)
  if (errorMsg) return res.status(400).send(errorMsg)
  const customer = await Customer.findById(req.body.customerID)
  if (!customer) return res.status(404).send('Customer not found')

  const movie = await Movie.findById(req.body.movieID)
  if (!movie) return res.status(404).send('Movie not found')

  if (movie.numberInStock === 0)
    return res.status(404).send('Movie is out of stock')

  req.body.customerID = undefined
  const newRental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  })

  try {
    transaction.insert('Rental', newRental)
    transaction.update('Movie', req.body.movieID, {
      $inc: { numberInStock: -1 },
    })
    const result = await transaction.run()

    res.send(result[0])
  } catch (error) {

    await transaction.rollback().catch(console.log)
    transaction.clean()

    res.status(500).send(error.message)
  }
})

module.exports = router
