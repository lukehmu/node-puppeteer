const path = require('path')
const puppeteer = require('puppeteer')
const phantom = require('phantom')

const pdfDir = 'pdf'

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

module.exports.generatePDF = generatePDF
