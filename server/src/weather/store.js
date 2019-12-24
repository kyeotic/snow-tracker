'use strict'

const request = require('request-micro')
const urlJoin = require('url-join')
const { wrapper } = require('lambda-logger-node')

const _logger = Symbol('_logger')
const _baseUrl = Symbol('_baseUrl')

class WeatherStore {
  constructor({ config, logger }) {
    this[_logger] = wrapper(logger)
    this[_baseUrl] = config.baseUrl
  }

  async getBase() {
    let base = await fetch(this, { url: '/' })
    return base
  }
}

module.exports = {
  WeatherStore
}

async function fetch(store, params) {
  let url = urlJoin(store[_baseUrl], params.url)
  let response = await request({
    ...params,
    url,
    headers: {
      Accept: 'application/json',
      'User-Agent': 'snow.kye.dev',
      ...params
    }
  })
  if (request.isErrorStatus(response)) {
    store[_logger].error(
      'Weather Error',
      response.statusCode,
      response.data.toString()
    )
    throw new Error(
      `Weather Error ${response.statusCode} ${response.data.toString()}`
    )
  }
  return JSON.parse(response.data.toString())
}
