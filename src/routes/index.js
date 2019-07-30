const routes = require('express').Router()
const passport = require('passport')
const Strategy = require('passport-http').BasicStrategy
const Joi = require('@hapi/joi')
const pdfController = require('../controllers/pdfController')
const users = require('../db/users')

/*
 * using the passport-http library to implement http 'digest' authentication
 * user(s) are defined in the db/users.js and the .env file
 */
passport.use(new Strategy(
  ((username, password, cb) => {
    users.findByUsername(username, (err, user) => {
      if (err) { return cb(err) }
      if (!user) { return cb(null, false) }
      if (user.password !== password) { return cb(null, false) }
      return cb(null, user)
    })
  }),
))

const requestSchema = Joi.object().keys({
  renderer: Joi.string().alphanum().required(),
  htmlURL: Joi.string().uri().required(),
  pdfOptions: Joi.object().keys({
    width: Joi.number().max(5000).positive().optional(),
    height: Joi.number().max(5000).positive().optional(),
  }).and('width', 'height'),
})

/*
 * @deprecated
 */
routes.get('/api/pdf',
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    pdfController.getPDF(req, res)
  })

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
