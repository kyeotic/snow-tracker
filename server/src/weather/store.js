'use strict'

const request = require('request-micro')
const urlJoin = require('url-join')
const { wrapper } = require('lambda-logger-node')

const _logger = Symbol('_logger')
const _config = Symbol('_config')

class WeatherStore {
  constructor({ config, logger }) {
    this[_logger] = wrapper(logger)
    this[_config] = config
  }

  async getBase() {
    let base = await fetch(this, { url: '/' })
    return base
  }

  async getForecast() {
    let base = await fetch(this, { url: '/forecast' })
    return base.properties.periods
  }
}

module.exports = {
  WeatherStore
}

async function fetch(store, params) {
  let url = urlJoin(store[_config].baseUrl, params.url)
  let response = await request({
    ...params,
    url,
    headers: {
      Accept: 'application/json',
      'User-Agent': store[_config].userAgent,
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
