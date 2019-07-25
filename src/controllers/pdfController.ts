// const path = require('path')
import * as path from 'path'

const puppeteer = require('puppeteer')
const phantom = require('phantom')

const nodeAppRoot = require('../config')

require('dotenv').config()

const pdfDir = 'pdf'

function generateTimeStampFileName() {
  const fileName = `${Date.now().toString()}.pdf`
  const fullPath = path.join(nodeAppRoot, pdfDir, fileName)
  console.log(fullPath)
  return fullPath
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
async function puppeteerPDF(htmlURL: string, format: string, width: number, height: number) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
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

async function phantomPDF(htmlURL: string) {
  // const instance = await phantom.create()
  // const page = await instance.createPage()
  // await page.on('onResourceRequested', (requestData: any) => {
  //   console.info('Requesting', requestData.url)
  // })
  // await page.open(htmlURL).then((status: any) => {
  //   if (status !== 'success') {
  //     throw Error('PhantomPDF generation failed - could not get URL')
  //   }
  // })
  // await page.render(pdfFileName)
  // await console.log('Phantom PDF created')
  // await instance.exit()
  // return pdfFileName
}

async function generatePDF(req: any, res: any) {
  // const pdfFileName = generateTimeStampFileName()
  const { body } = req
  const { htmlURL } = body
  const { renderer } = body
  const { format } = body
  const { width } = body
  const { height } = body
  const { apiKey } = body
  if (!apiKey) {
    console.log('Invalid API KEY')
    res.status(403).json({
      message: 'No API key provided </3>',
    })
  } else if (apiKey !== process.env.APIKEY) {
    console.log(apiKey)
    console.log(process.env.APIKEY)
    res.status(403).json({
      message: 'Invalid API KEY',
    })
  }
  switch (renderer) {
    case 'puppeteer':
      await puppeteerPDF(htmlURL, format, width, height)
        .then((pdf) => {
          console.log('PDF Promise fulfilled')
          // res.sendFile(pdf)
          // res.setHeader()
          res.set('Content-Type', 'application/pdf')
          res.send(Buffer.from(pdf, 'binary'))
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
      await phantomPDF(htmlURL)
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
  return 'done'
}

function getPDF(req: any, res: any) {
  const pdfQuery = req.query.pdf
  if (pdfQuery) {
    res.sendFile(path.join(nodeAppRoot, pdfDir, pdfQuery), (err: any) => {
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
