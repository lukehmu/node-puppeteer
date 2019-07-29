const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')

// create the express app

const app = express()


// bodyParser creates an accessible `body` object on the `request` object
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

// reference our router index
app.use('/', routes)


// error handler middleware
// @todo refactor to use separate function in errorController.js
app.use((err, req, res, next) => {
  console.error(`Middleware error from Express: ${err}`)
  res.status(400).send({
    errors:
    {
      status: 400,
      message: err.message,
      originalRequest: req.body,
    },
  })
})

// use either the port defined in the env file, else default to 3000
const port = process.env.PORT || 3000

const server = app.listen(port, () => console.log(`Running on http://localhost:${port}`))

// make server avilable for testing
module.exports.server = server
