const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const allRoutes = require('./routes')

// global.appRoot = path.resolve(__dirname)
// Global.appRoot = path.dirname(require.main.filename)

const app = express()
app.use(bodyParser.json())
app.use('/', allRoutes)
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Running on http://localhost:${port}!`))
export {}
