const jm = require('json-msg')
module.exports = function (req, res, next) {
  const error = jm.validate(req.params.id, jm.objectID({ label: 'ID' }))

  if (error) return res.status(400).send(error)

  next()
}
