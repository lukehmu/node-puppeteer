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

// use either the port defined in the env file, else default to 3000
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Running on http://localhost:${port}`))
