const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')

// global.appRoot = path.resolve(__dirname)

const app = express()
app.use(bodyParser.json())
app.use('/', routes)
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Running on http://localhost:${port}!`))
// console.log(path.dirname(require.main.filename))
