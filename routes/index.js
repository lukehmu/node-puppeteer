const routes = require('express').Router()
const passport = require('passport')
const Strategy = require('passport-http').DigestStrategy
const pdfController = require('../controllers/pdfController')
const users = require('../db/users')

passport.use(new Strategy({ qop: 'auth' },
  ((username, cb) => {
    users.findByUsername(username, (err, user) => {
      if (err) { return cb(err) }
      if (!user) { return cb(null, false) }
      return cb(null, user, user.password)
    })
  })))

routes.get('/api/pdf',
  passport.authenticate('digest', { session: false }),
  (req, res) => {
    pdfController.getPDF(req, res)
  })

routes.post('/api/pdf',
  passport.authenticate('digest', { session: false }),
  (req, res) => {
    pdfController.generatePDF(req, res)
  })

routes.get('*', (req, res) => {
  res.status(404).json({ message: 'Not a valid GET route' })
})

routes.post('*', (req, res) => {
  res.status(404).json({ message: 'Not a valid POST route' })
})

module.exports = routes
