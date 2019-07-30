const testRequest = require('supertest')
const { describe, it } = require('mocha')
const app = require('../src/app')
require('dotenv').config()

const successRequestJSON = {
  renderer: 'puppeteer',
  htmlURL: 'https://www.google.co.uk',
  pdfOptions: {
    width: 595,
    height: 842,
  },
}

const failNoRendererRequestJson = {
  renderer: '',
  htmlURL: 'https://www.google.co.uk',
  pdfOptions: {
    width: 595,
    height: 842,
  },
}

/**
 * testing PDF is generated for google.co.uk
 */
describe('POST /api/v1/pdf', () => {
  it('respond with a binary file (pdf)', async () => testRequest(app.server)
    .post('/api/v1/pdf')
    .send(successRequestJSON)
    .auth(process.env.APIUSER, process.env.APIKEY)
    .set('Accept', 'application/pdf')
    .expect('Content-Type', /pdf/)
    .expect(201)
    .then((res) => {
      if (res.status !== 201) {
        console.log(`http status was ${res.status} instead of 201`)
      }
    }))

  /**
   * testing the no renderer error reponse
   */
  it('respond with incorrect renderer defined', async () => testRequest(app.server)
    .post('/api/v1/pdf')
    .send(failNoRendererRequestJson)
    .auth(process.env.APIUSER, process.env.APIKEY)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400, {
      errors: {
        status: 400,
        message: 'ValidationError: child "renderer" fails because ["renderer" is not allowed to be empty]',
        originalRequest: failNoRendererRequestJson,
      },
    })
    .then((res) => {
      if (res.status !== 400) {
        console.log(`Expecting http status 400 but got: ${res.status}`)
      }
    }))

  /**
   * testing PDF generation error response
   */
  it('respond with PDF generation error', async () => {
    const htmlURL = 'https://www.googl'
    return testRequest(app.server)
      .post('/api/v1/pdf')
      .send({
        renderer: 'puppeteer',
        htmlURL,
      })
      .auth(process.env.APIUSER, process.env.APIKEY)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        if (res.status !== 400) {
          console.log(`Expecting http status 400 but got: ${res.status}`)
        }
      })
  })
})
