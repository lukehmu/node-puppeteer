const testRequest = require('supertest')
const { describe, it } = require('mocha')
const app = require('../src/app')
require('dotenv').config()


// const { describe } = mocha
// const { it } = mocha

/**
 * testing PDF api
 */
describe('POST /api/v1/pdf', () => {
  it('respond with a binary file (pdf)', (done) => {
    testRequest(app.server)
      .post('/api/v1/pdf')
      .send({
        renderer: 'puppeteer',
        htmlURL: 'https://www.google.co.uk',
      })
      .auth(process.env.APIUSER, process.env.APIKEY)
      .set('Accept', 'application/pdf')
      .expect('Content-Type', /pdf/)
      .expect(201)
      .end((err, res) => {
        console.log(res.body)
        console.log(res.header)
        done(err)
      })
  })
})
