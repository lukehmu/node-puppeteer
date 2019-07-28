/**
 * Error Controller handles sending errors back to the client
 * @module controllers/errorController
 * Currently unused
 */

// const { RequestError } = require('./lib/errors')


function handleError(err, req, res) {
  console.log(`body: ${req.body.status}`)
  res.status(req.status).json({
    error: {
      message: err.message,
      submittedURL: req.body.htmlURL,
    },
  })
}


module.exports = handleError
