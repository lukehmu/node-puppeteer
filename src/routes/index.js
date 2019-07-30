const routes = require('express').Router()
// const Joi = require('@hapi/joi')
const pdfController = require('../controllers/pdfController')
const passport = require('../config/auth')
const requestSchema = require('../schemas/requestSchema')

/*
 * passes an authenticated POST request to /api/pdf to the PDF controller
 */
routes.post('/api/v1/pdf',
  passport.authenticate('basic', { session: false }),
  (req, res, next) => {
    // validating the request against the schema
    requestSchema.validate(req.body, (err, value) => {
      if (err !== null) { throw new Error(err) }
    })
    // passing `next` to `catch` triggers the error handling middleware
    // in app.js
    pdfController.generatePDF(req, res).catch(next)
  })

/*
 * all other GET requests are returned as 404s
 */
routes.get('*', (req, res) => {
  res.status(404).json({ message: 'Not a valid GET route' })
})

/*
 * all other POST requests are returned as 404s
 */
routes.post('*', (req, res) => {
  res.status(404).json({ message: 'Not a valid POST route' })
})

module.exports = routes
