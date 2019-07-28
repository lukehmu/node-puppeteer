const routes = require('express').Router()
const passport = require('passport')
const Strategy = require('passport-http').BasicStrategy
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
    // passing `next` to `catch` triggers the error handling middleware
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
