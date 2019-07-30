/*
 * schemas/requestSchema.js
 * Example valid JSON for requestSchema
{
    "renderer": "puppeteer",
    "htmlURL": "http://www.google.co.uk",
    "pdfOptions" : {
    "width": 100,
    "height": 100
    }
}
 */

const Joi = require('@hapi/joi')

const requestSchema = Joi.object().keys({
  renderer: Joi.string().alphanum().required(),
  htmlURL: Joi.string().uri().required(),
  pdfOptions: Joi.object().keys({
    width: Joi.number().max(5000).positive().optional(),
    height: Joi.number().max(5000).positive().optional(),
  }).and('width', 'height'),
})

module.exports = requestSchema
