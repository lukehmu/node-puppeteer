const path = require('path')
const puppeteer = require('puppeteer')
const phantom = require('phantom')
require('dotenv').config()

const pdfDir = 'pdf'

function generateTimeStampFileName() {
  const fileName = `${Date.now().toString()}.pdf`
  return fileName
}

/**
 * Creates a PDF for a given URL using Puppeteer and returns a binary file inside a buffer
 *
 * @async
 * @param htmlURL a public URL to the HTML you wish to convert
 * @param pdfFileName depricated
 * @param format American standard paper sizes e.g. A4, A3. Prefer to use width and height
 * @param width specify the width of the PDF
 * @param height specify the height of the PDF
 */
async function puppeteerPDF(htmlURL, format, width, height) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.goto(htmlURL)
  const buffer = await page.pdf({
    // path: pdfFileName,
    format,
    printBackground: true,
    width,
    height,
  })
  await console.log('Puppeteer PDF created')
  return buffer
}

async function phantomPDF(htmlURL, pdfFileName) {
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

async function generatePDF(req, res) {
  const pdfFileName = generateTimeStampFileName()
  const { body } = req
  const { htmlURL } = body
  const { format } = body
  const { width } = body
  const { height } = body
  if (!body.apiKey) {
    console.log('Invalid API KEY')
    res.status(403).json({
      message: 'No API key provided',
    })
  } else if (body.apiKey !== process.env.APIKEY) {
    console.log(body.apiKey)
    console.log(process.env.APIKEY)
    res.status(403).json({
      message: 'Invalid API KEY',
    })
  }
  switch (body.renderer) {
    case 'puppeteer':
      await puppeteerPDF(htmlURL, format, width, height)
        .then((pdf) => {
          console.log('PDF Promise fulfilled')
          // res.sendFile(pdf)
          // res.setHeader()
          res.set('Content-Type', 'application/pdf')
          res.setHeader('Content-Disposition', `attachment; filename=${pdfFileName}`)
          res.send(Buffer.from(pdf.toString(), 'binary'))
          // res.attachment(pdf)
        })
        .catch((err) => {
          console.log(`generatePDF error ${err}`)
          res.send({
            error: err.message,
            submittedURL: htmlURL,
            submittedRenderer: renderer,
          })
        })
      break
    case 'phantom':
      await phantomPDF(htmlURL, pdfFileName)
        .then((pdf) => {
          console.log(`PDF Promise fulfilled ${pdf}`)
          res.status(201).sendFile(pdf)
        })
        .catch((err) => {
          console.log(`generatePDF error ${err}`)
          res.status(400).send({
            error: err.message,
            submittedURL: htmlURL,
            submittedRenderer: renderer,
          })
        })
      break
    default:
      res.status(400).send({
        error: 'No renderer found',
        submittedURL: htmlURL,
        submittedRenderer: renderer,
      })
  }
  return pdfFileName
}

function getPDF(req, res) {
  const pdfQuery = req.query.pdf
  if (pdfQuery) {
    res.sendFile(path.join(pdfDir, pdfQuery), (err) => {
      if (err) {
        res.status(404).json({
          message: 'Cannot find your file',
          suppliedFilename: pdfQuery,
        })
      }
    })
  } else {
    res.status(400).json({ message: 'Please use ?pdf=filename to retrieve a PDF' })
  }
}

module.exports.generatePDF = generatePDF
module.exports.getPDF = getPDF
