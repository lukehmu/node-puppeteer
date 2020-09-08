const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const routes = require('./routes')
const { errorHandler } = require('./controllers/errorController')

// create the express app

const app = express()

// bodyParser creates an accessible `body` object on the `request` object
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

// serve API docs
app.use('/apidocs', express.static(path.join(__dirname, '/views/apidocs')))

// reference our router index
app.use('/', routes)

// app.set('view engine', 'pug')

console.log(path.join(__dirname, '/views/apidocs'))

// error handler middleware
app.use((err, req, res, next) => {
  console.error(`Middleware error from Express: ${err}`)
  errorHandler(err, req, res)
})

// use either the port defined in the env file, else default to 3000
const port = process.env.PORT || 3000

const server = app.listen(port, () => console.log(`Running on http://localhost:${port}`))

// make server avilable for testing
module.exports.server = server
