const routes = require('express').Router()
const pdfController = require('../controllers/pdfController')

routes.get('/api/pdf', (req: any, res: any) => {
  pdfController.getPDF(req, res)
})

routes.post('/api/pdf', (req: any, res: any) => {
  pdfController.generatePDF(req, res)
})

routes.get('*', (req: any, res: any) => {
  res.status(404).json({ message: 'Not a valid GET route' })
})

routes.post('*', (req: any, res: any) => {
  res.status(404).json({ message: 'Not a valid POST route' })
})

module.exports = routes
