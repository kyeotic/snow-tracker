/* eslint-disable no-console */

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { handler } from '../src/api.js'

const app = express()
const PORT = process.env.PORT || 3100

app.use(cors())
app.use(bodyParser.json())

process.env.stage = 'local'
process.env.TEST = true

app.all('/*', (req, res) => {
  let binaryReq = req.headers.accept === 'application/octet-stream'
  let body = binaryReq ? req.body : JSON.stringify(req.body)
  console.log('local event', req.url)
  let event = {
    path: req.url,
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
