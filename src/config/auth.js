/**
 * Auth module
 * Passport auth related functionality
 * @module config/auth
 */

const passport = require('passport')
const Strategy = require('passport-http').BasicStrategy
const users = require('../config/users')

/*
 * using the passport-http library to implement http 'digest' authentication
 * user(s) are defined in the config/users.js and the .env file
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

module.exports = passport
