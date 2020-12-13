'use strict'

const request = require('request-micro')
const urlJoin = require('url-join')
const { assert } = require('../util/assert')
const { wrapper } = require('lambda-logger-node')

const _logger = Symbol('_logger')
const _config = Symbol('_config')

class WeatherStore {
  constructor({ config, logger }) {
    this[_logger] = wrapper(logger)
    this[_config] = config
  }

  async getForecast(point) {
    assert(point, 'required: "point"')
    const base = await fetch(this, {
      url: this.api('points', point, '/forecast')
    })
    return base.properties.periods
  }

  async getCurrentConditions(point) {
    assert(point, 'required: "point"')
    const base = await fetch(this, {
      url: this.api('points', point, '/forecast/hourly')
    })
    // console.log('base', base)
    let current = base.properties.periods[0]
    let icon = 'clear'
    let match = current.icon.match(/land\/(.+?)\/(.+?)[?,]/)
    if (match) {
      icon = match.slice(1, 3).join('-')
    }
    return {
      condition: current.shortForecast,
      temperature: Math.floor(
        current.temperatureUnit === 'F'
          ? current.temperature
          : celsiusToFahrenheit(current.temperature)
      ),
      iconClass: `weather-icon wi wi-${icon}`
    }
  }

  async getStationConditions(stationId) {
    assert(stationId, 'required: "stationId"')
    const base = await fetch(this, {
      url: this.api('stations', stationId, 'observations/latest')
    })
    const condition = base.properties.textDescription
    return {
      condition,
      temperature: Math.floor(
        celsiusToFahrenheit(base.properties.temperature.value)
      ),
      iconClass: `weather-icon wi wi-${condition.toLowerCase()}`
    }
  }

  api(...parts) {
    return urlJoin(this[_config].baseUrl, ...parts)
  }
}

module.exports = {
  WeatherStore
}

async function fetch(store, params) {
  const response = await request({
    ...params,
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

function celsiusToFahrenheit(celsius) {
  return celsius * 1.8 + 32
}
