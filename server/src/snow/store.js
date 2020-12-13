'use strict'

const request = require('request-micro')
const { wrapper } = require('lambda-logger-node')

const _config = Symbol('_config')
const _logger = Symbol('_logger')
const _parser = Symbol('_parser')
const _parserFactory = Symbol('_parserFactory')
const _weather = Symbol('_weather')

class ConditionsStore {
  constructor({ config, logger, weather, parserFactory }) {
    this[_config] = config
    this[_logger] = wrapper(logger)
    this[_parserFactory] = parserFactory
    this[_weather] = weather
  }

  async getCondition() {
    await this.getSource()
    return this[_parser].getCondition()
  }

  async getLiftStatuses() {
    await this.getSource()
    return this[_parser].getLiftStatuses()
  }

  async getSnowfall() {
    await this.getSource()
    return this[_parser].getSnowfall()
  }

  async getLastUpdatedTime() {
    await this.getSource()
    return this[_parser].getLastUpdatedTime()
  }

  async getForecast() {
    try {
      return await this[_weather].getForecast(this[_config].weather.point)
    } catch (e) {
      this[_logger].error('error getting forecast', e.message, e.stack)
      return null
    }
  }

  async getStationConditions() {
    // console.log('config', this[_config])
    return this[_weather].getStationConditions(this[_config].weather.station)
  }

  async getCurrentConditions() {
    try {
      return await this[_weather].getCurrentConditions(
        this[_config].weather.point
      )
    } catch (e) {
      this[_logger].error('error getting conditions', e.message, e.stack)
      return null
    }
  }

  async getSource() {
    // If set, return it
    // If its a promise from a pending run it will be awaited
    if (this[_parser]) return this[_parser]
    // Set to a promise so that it can be awaited in parallel
    this[_parser] = loadSource(this)
    // Wait for promise and assign result to store
    this[_parser] = await this[_parser]
  }
}

module.exports = {
  ConditionsStore,
  _config,
  _logger,
  _parser,
  _weather
}

async function loadSource(store) {
  let response = await request({ url: store[_config].conditionsUrl })
  if (request.isErrorStatus(response)) {
    store[_logger].error(
      'Conditions Error',
      response.statusCode,
      response.data.toString()
    )
    throw new Error(`Error getting conditions: ${response.statusCode}`)
  }
  return store[_parserFactory]({ html: response.data.toString() })
}
