const express = require('express')
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')
const phantom = require('phantom')
const path = require('path')

const pdfDir = 'pdf'

const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
const port = process.env.PORT || 3000

function generateTimeStampFileName() {
  const fileName = `${Date.now().toString()}.pdf`
  const fullPath = path.join(__dirname, pdfDir, fileName)
  return fullPath
}

async function puppeteerPDF(htmlURL, pdfFileName) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.goto(htmlURL)
  await page.pdf({ path: pdfFileName })
  await console.log('Puppeteer PDF created')
  return pdfFileName
}

async function phantomPDF(htmlURL, pdfFileName) {
  // console.log(`ye ${htmlURL} ${pdfFileName}`)
  const instance = await phantom.create()
  const page = await instance.createPage()
  await page.on('onResourceRequested', (requestData) => {
    console.info('Requesting', requestData.url)
  })
  await page.open(htmlURL).then((status) => {
    if (status !== 'success') {
      throw Error('PhantomPDF generation failed - could not get URL')
    }
  })
  await page.render(pdfFileName)
  await console.log('Phantom PDF created')
  await instance.exit()
  return pdfFileName
}

async function generatePDF(htmlURL, renderer) {
  const pdfFileName = generateTimeStampFileName()
  switch (renderer) {
    case 'puppeteer':
      await puppeteerPDF(htmlURL, pdfFileName)
        .then((pdf) => {
          console.log(`PDF Promise fulfilled ${pdf}`)
        })
        .catch((err) => {
          console.log(`generatePDF error ${err}`)
          throw err
        })
      break
    case 'phantom':
      await phantomPDF(htmlURL, pdfFileName)
        .then((pdf) => {
          console.log(`PDF Promise fulfilled ${pdf}`)
        })
        .catch((err) => {
          console.log(`generatePDF error ${err}`)
          throw err
        })
      break
    default:
      console.log('No renderer found')
      throw Error('No renderer found')
  }
  return pdfFileName
}

app.post('/api/pdf', (req, res) => {
  const { body } = req
  const { htmlURL } = body
  const { renderer } = body
  console.log(`Rendering engine: ${renderer}`)
  generatePDF(htmlURL, renderer)
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
  res.send('API docs')
})

app.listen(port, () => console.log(`Running on http://localhost:${port}!`))
