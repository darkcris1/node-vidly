const express = require('express')
const winston = require('winston')
require('dotenv').config()

const app = express()

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/custom-json-msg')()

const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () =>
  winston.info(`Listening on port ${PORT} ......`),
)

module.exports = server
