/* eslint-disable no-console */
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3100

app.use(cors())
app.use(bodyParser.json())

process.env.stage = 'local'
process.env.TEST = true

const handler = require('../src/api').handler

app.all('/*', (req, res) => {
  let binaryReq = req.headers.accept === 'application/octet-stream'
  let body = binaryReq ? req.body : JSON.stringify(req.body)
  console.log('local event', req.url)
  let event = {
    path: req.url.replace('v1/', ''),
    headers: {
      ...req.headers,
      Authorization: req.headers.authorization
    },
    method: req.method,
    httpMethod: req.method,
    body,
    queryStringParameters: req.query
  }
  handler(event, {}).then(response => {
    if (binaryReq) {
      res.setHeader('content-type', 'application/octet-stream')
      res.send(Buffer.from(response.body.toString(), 'base64'))
    } else {
      res.status(response.statusCode)
      res.set(response.headers)
      res.send(JSON.parse(response.body))
    }
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
