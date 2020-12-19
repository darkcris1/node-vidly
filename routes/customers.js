const express = require('express')
const { Customer, validate } = require('../models/customers')

const router = express.Router()

router.get('/', async (req, res) => {

  const customers = await Customer.find().sort('name')
  res.send(customers)

})

router.get('/:id', async (req, res) => {

  const customer = await Customer.findById(req.params.id)
  if (!customer) return res.status(404).send('Customer not found')

  res.send(customer)

})

router.delete('/:id', async (req, res) => {

  const customer = await Customer.findByIdAndRemove(req.params.id)
  if (!customer) return res.status(404).send('Customer not found')

  res.send(customer)
})

router.post('/', async (req, res) => {
  const errorMsg = validate(req.body)
  if (errorMsg) return res.status(400).send(errorMsg)

  const newCustomer = new Customer(req.body)
  const result = await newCustomer.save()
  res.send(result)
})

router.put('/:id', async (req, res) => {
  const errorMsg = validate(req.body)

  if (errorMsg) return res.status(400).send(errorMsg)

  const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.send(updatedCustomer)
})
module.exports = router
