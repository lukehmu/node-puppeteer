/**
 * Error Controller handles sending errors back to the client
 * @module controllers/errorController
 */

// const { RequestError } = require('./lib/errors')

function errorHandler(err, req, res) {
  res.status(400).json({
    errors:
    {
      status: 400,
      message: err.message,
      originalRequest: req.body,
    },
  })
}

module.exports.errorHandler = errorHandler
