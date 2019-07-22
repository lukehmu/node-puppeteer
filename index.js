const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const PDF = require('./generate-pdf')

const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
const port = process.env.PORT || 3000
const htmlIndex = path.join(__dirname, 'index.html')

app.post('/api/pdf', (req, res) => {
  const { body } = req
  const { htmlURL } = body
  const { renderer } = body
  console.log(`Rendering engine: ${renderer}`)
  // generatePDF(htmlURL, renderer)
  PDF.generatePDF(htmlURL, renderer)
    .then((pdfFileName) => {
      res.sendFile(path.join(pdfFileName))
    })
    .catch((err) => {
      res.send({
        error: err.message,
        submittedURL: htmlURL,
      })
    })
})

app.get('/api/pdf', (req, res) => {
  res.sendFile(htmlIndex)
})

app.listen(port, () => console.log(`Running on http://localhost:${port}!`))
