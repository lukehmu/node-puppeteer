const express = require('express')
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')
const path = require('path')


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true,
}))
const port = process.env.PORT || 3000

async function processHTML(htmlURL) {
  const fileName = `${Date.now().toString()}.pdf`
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(htmlURL)
  await page.pdf({ path: fileName })
  // console.log(fileName)
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
        .then((data) => {
          const pdf = data
          // console.log(pdf)
          res.sendFile(path.join(__dirname, pdf))
        })
      break
    default:
      res.send('No renderer found')
  }
})

app.listen(port, () => console.log(`Running on http://localhost:${port}!`))
