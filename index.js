const express = require('express')
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')
const path = require('path')

const pdfDir = 'pdf'


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true,
}))
const port = process.env.PORT || 3000

async function processHTML(htmlURL) {
  const fileName = `${Date.now().toString()}.pdf`
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  const pageRequest = await page.goto(htmlURL)
  console.log(`after${pageRequest}`)
  await page.pdf({ path: `${pdfDir}/${fileName}` })
  return fileName
}

app.post('/api/pdf', (req, res) => {
  const { body } = req
  const { htmlURL } = body
  const { renderer } = body
  switch (renderer) {
    case 'puppeteer':
      console.log('puppteer')
      processHTML(htmlURL)
        .then((pdf) => {
          console.log('HI HI')
          res.sendFile(path.join(__dirname, pdfDir, pdf))
        })
        .catch((err) => {
          res.send(err)
        })
      break
    default:
      res.send('No renderer found')
  }
})

app.get('/api/pdf', (req, res) => {
  res.send('API docs')
})

app.listen(port, () => console.log(`Running on http://localhost:${port}!`))
