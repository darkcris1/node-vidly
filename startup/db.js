const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')
const dbURL = config.get('db')

module.exports = function () {
  mongoose
    .connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => winston.info(`Database Connected ${dbURL}`))
}
