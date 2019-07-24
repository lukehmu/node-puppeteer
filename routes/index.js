const routes = require('express').Router()
const pdfController = require('../controllers/pdfController.js')

routes.get('/api/pdf', (req, res) => {
  pdfController.getPDF(req, res)
})

routes.post('/api/pdf', (req, res) => {
  pdfController.generatePDF(req, res)
})

routes.get('*', (req, res) => {
  res.status(404).json({ message: 'Not a valid GET route' })
})

routes.post('*', (req, res) => {
  res.status(404).json({ message: 'Not a valid POST route' })
})

module.exports = routes