/**
 * PDF Controller handles generating PDFs
 * @module controllers/pdfController
 */

const path = require('path')
const puppeteer = require('puppeteer')
const phantom = require('phantom')
require('dotenv').config()

const pdfDir = 'pdf'

/**
 *  returns a string based on the current date/time
 * @returns {String} fileName
 * */
function generateTimeStampFileName() {
  const fileName = `${Date.now().toString()}.pdf`
  return fileName
}

/**
 * Creates a PDF for a given URL using Puppeteer and returns a binary file inside a buffer
 *
 * @async
 * @param {String} htmlURL a public URL to the HTML you wish to convert
 * @param {Number} width specify the width of the PDF in pixels
 * @param {Number} height specify the height of the PDF pixels
 * @returns {Buffer} buffer
 */
async function puppeteerPDF(htmlURL, pdfOptions = { width: 595, height: 842 }) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.goto(htmlURL)
  console.log(pdfOptions.width)
  console.log(htmlURL)
  const buffer = await page.pdf({
    printBackground: true,
    width: pdfOptions.width,
    height: pdfOptions.height,
  })
  // await console.log('Puppeteer PDF created')
  return buffer
}

/**
 * This function shouldn't be used
 * No need for phantom PDF rendering
 * @param {string} htmlURL
 * @param {string} pdfFileName
 * @deprecated
 */
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

/**
 * picks up the JSON posted from the API and
 * triggers rendering the PDF via the specified renderer
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function generatePDF(req, res) {
  const pdfFileName = generateTimeStampFileName()
  const { body } = req
  const { htmlURL } = body
  const { renderer } = body
  const { pdfOptions } = body
  switch (renderer) {
    case 'puppeteer':
      await puppeteerPDF(htmlURL, pdfOptions)
        .then((pdf) => {
          // console.log('PDF Promise fulfilled')
          // res.sendFile(pdf)
          // res.setHeader()
          res.set('Content-Type', 'application/pdf')
          res.setHeader('Content-Disposition', `attachment; filename=${pdfFileName}`)
          res.status(201).send(Buffer.from(pdf, 'binary'))
          // res.attachment(pdf)
        })
        .catch((err) => {
          // @todo create custom Error
          throw new Error(err)
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
            errors: {
              error: err.message,
              submittedURL: htmlURL,
              submittedRenderer: renderer,

            },
          })
        })
      break
    default:
      res.status(400).send({
        errors: {
          error: 'No renderer found',
          submittedURL: htmlURL,
          submittedRenderer: renderer,
        },
      })
  }
  return pdfFileName
}

/**
 * currently not being used
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @deprecated
 */
function getPDF(req, res) {
  const pdfQuery = req.query.pdf
  if (pdfQuery) {
    res.sendFile(path.join(pdfDir, pdfQuery), (err) => {
      if (err) {
        res.status(404).json({
          errors: {
            message: 'Cannot find your file',
            suppliedFilename: pdfQuery,
          },
        })
      }
    })
  } else {
    res.status(400).json({ message: 'Please use ?pdf=filename to retrieve a PDF' })
  }
}

module.exports.generatePDF = generatePDF
module.exports.getPDF = getPDF
