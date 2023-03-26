import { urlJoin } from 'url-join'
import { DateTime } from 'luxon'
import { assert } from '../util/assert.ts'
import { wrapper, type ILogger } from '../util/logger.ts'
import { Condition, GridPoint } from './types.ts'
import { WeatherConfig } from '../../config.ts'

export class WeatherStore {
  private config: WeatherConfig
  private logger: ILogger

  constructor({ config, logger }: { config: WeatherConfig; logger: ILogger }) {
    this.logger = wrapper(logger)
    this.config = config
  }

  async getForecast(grid: GridPoint) {
    assert(grid, 'required: "grid"')
    const base = await this.fetch(
      this.api('gridpoints', grid.id, `${grid.x},${grid.y}`, '/forecast')
    )
    this.logger.debug('weather cast', base.properties.periods[0])
    return base.properties.periods
  }

  async getCurrentConditions(grid: GridPoint): Promise<Condition> {
    assert(grid, 'required: "grid"')
    const base = await this.fetch(
      this.api('gridpoints', grid.id, `${grid.x},${grid.y}`, '/forecast/hourly')
    )
    // console.log('base', base)
    let updatedOn = DateTime.fromISO(base.properties.updateTime).toISO()
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
    const base = await this.fetch(this.api('stations', stationId, 'observations/latest'))
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

  async fetch(url: string, params?: RequestInit) {
    const response = await fetch(url, {
      ...params,
      headers: {
        Accept: 'application/json',
        'User-Agent': this.config.userAgent,
        ...params?.headers,
      },
    })
    if (!response.ok) {
      const body = await response.text()
      this.logger.error('Weather Error', response.status, body)
      throw new Error(`Weather Error ${response.status} ${body}`)
    }
    return response.json()
  }
}

function celsiusToFahrenheit(celsius: number) {
  return celsius * 1.8 + 32
}
