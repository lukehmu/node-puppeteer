const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

async function uploadThePDF(filePath) {
  AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  })

  const params = {
    Bucket: process.env.S3_BUCKET,
    Body: fs.createReadStream(filePath),
    Key: `folder/${Date.now()}_${path.basename(filePath)}`,
  }
  const putObjectPromise = s3.putObject(params).promise()
  putObjectPromise
    .then((data) => {
      console.log('Success')
      return data.Location
    })
    .catch((err) => {
      console.log(err)
    })
}
module.exports.uploadThePDF = uploadThePDF
