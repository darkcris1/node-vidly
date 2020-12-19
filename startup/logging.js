const winston = require('winston')
require('express-async-errors')

const { transports, format } = winston
const { simple, prettyPrint, colorize } = format
module.exports = function () {
  process.on('unhandledRejection', (ex) => {
    throw ex
  })

  winston.add(
    new transports.Console({
      format: format.combine(simple(), prettyPrint(), colorize()),
      level: 'error',
    }),
  )
  winston.add(new transports.File({ filename: 'logfile.log' }))
  winston.add(
    new transports.File({
      filename: 'uncaughtExceptions.log',
      handleExceptions: true,
      level: 'error',
    }),
  )
}
