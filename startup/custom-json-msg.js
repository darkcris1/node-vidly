const jm = require('json-msg')
const mongoose = require('mongoose')
module.exports = function () {
  jm.defaultMessage({
    string: {
      isObjectID: '%label% is not an objectID',
    },
  })
  jm.objectID = (config) =>
    jm.str({ ...config, isObjectID: mongoose.Types.ObjectId.isValid })
}
