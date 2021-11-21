import request from 'request-micro'
import urlJoin from 'url-join'
import { assert } from '../util/assert.js'
import { wrapper } from 'lambda-logger-node'

const _logger = Symbol('_logger')
const _config = Symbol('_config')

export class WeatherStore {
  constructor({ config, logger }) {
    this[_logger] = wrapper(logger)
    this[_config] = config
  }

  async getForecast(grid) {
    assert(grid, 'required: "grid"')
    const base = await fetch(this, {
      url: this.api('gridpoints', grid.id, `${grid.x},${grid.y}`, '/forecast')
    })
    return base.properties.periods
  }

  async getCurrentConditions(grid) {
    assert(grid, 'required: "grid"')
    const base = await fetch(this, {
      url: this.api(
        'gridpoints',
        grid.id,
        `${grid.x},${grid.y}`,
        '/forecast/hourly'
      )
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
