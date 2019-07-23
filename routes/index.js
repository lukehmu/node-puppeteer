const routes = require('express').Router()
const pdfController = require('../controllers/pdfController.js')

routes.get('/api/pdf', (req, res) => {
  res.status(200).json({ message: 'my future api docs?!' })
})

routes.post('/api/pdf', (req, res) => {
  pdfController.generatePDF(req, res)
})

module.exports = routes
