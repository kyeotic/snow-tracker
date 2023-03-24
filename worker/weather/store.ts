import request, { isErrorStatus, RequestOptions } from 'request-micro'
import urlJoin from 'url-join'
import { assert } from '../util/assert'
import { wrapper, type ILogger } from '../util/logger'
import { DateTime } from 'luxon'
import { WeatherConfig, GridPoint } from '../config.js'
import { Condition } from './types'

export class WeatherStore {
  private config: WeatherConfig
  private logger: ILogger

  constructor({ config, logger }: { config: WeatherConfig; logger: ILogger }) {
    this.logger = wrapper(logger)
    this.config = config
  }

  async getForecast(grid: GridPoint) {
    assert(grid, 'required: "grid"')
    const base = await this.fetch({
      url: this.api('gridpoints', grid.id, `${grid.x},${grid.y}`, '/forecast'),
    })
    this.logger.debug('weather cast', base.properties.periods[0])
    return base.properties.periods
  }

  async getCurrentConditions(grid: GridPoint): Promise<Condition> {
    assert(grid, 'required: "grid"')
    const base = await this.fetch({
      url: this.api('gridpoints', grid.id, `${grid.x},${grid.y}`, '/forecast/hourly'),
    })
    // console.log('base', base)
    let updatedOn = DateTime.fromISO(base.properties.updateTime).toJSDate()
    let current = base.properties.periods[0]
    let icon = 'clear'
    let match = current.icon.match(/land\/(.+?)\/(.+?)[?,]/)
    if (match) {
      icon = match.slice(1, 3).join('-')
    }
    return {
      updatedOn,
      condition: current.shortForecast,
      temperature: Math.floor(
        current.temperatureUnit === 'F'
          ? current.temperature
          : celsiusToFahrenheit(current.temperature)
      ),
      iconClass: `weather-icon wi wi-${icon}`,
    }
  }

  async getStationConditions(stationId: string) {
    assert(stationId, 'required: "stationId"')
    const base = await this.fetch({
      url: this.api('stations', stationId, 'observations/latest'),
    })
    const condition = base.properties.textDescription
    return {
      condition,
      temperature: Math.floor(celsiusToFahrenheit(base.properties.temperature.value)),
      iconClass: `weather-icon wi wi-${condition.toLowerCase()}`,
    }
  }

  api(...parts: string[]) {
    return urlJoin(this.config.baseUrl, ...parts)
  }

  async fetch(params: RequestOptions) {
    const response = await request({
      ...params,
      headers: {
        Accept: 'application/json',
        'User-Agent': this.config.userAgent,
        ...params?.headers,
      },
    })
    if (isErrorStatus(response)) {
      this.logger.error('Weather Error', response.statusCode, response.data.toString())
      throw new Error(`Weather Error ${response.statusCode} ${response.data.toString()}`)
    }
    return JSON.parse(response.data.toString())
  }
}

function celsiusToFahrenheit(celsius: number) {
  return celsius * 1.8 + 32
}
