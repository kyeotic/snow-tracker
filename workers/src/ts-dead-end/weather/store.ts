/* eslint-disable @typescript-eslint/no-non-null-assertion */
import urlJoin from 'url-join'
import { DateTime } from 'luxon'

import { assert } from '../util/assert'
import { Logger, wrapper } from '../util/logger'

export interface WeatherStoreConfig {
  baseUrl: string
  userAgent: string
}

interface GridPoint {
  id: string
  x: number
  y: number
}

interface CurrentConditions {
  updatedOn: string
  condition?: string
  temperature: number
  iconClass: string
}

type StationCondition = Omit<CurrentConditions, 'updatedOn'>

export class WeatherStore {
  private config: WeatherStoreConfig
  private logger: Logger

  constructor({ config, logger }: { config: WeatherStoreConfig; logger?: Logger }) {
    this.logger = wrapper(logger)
    this.config = config
  }

  async getForecast(
    grid: GridPoint
  ): Promise<Weather.Responses.GridpointForecast['properties']['periods']> {
    assert(grid, 'required: "grid"')
    const base = await this.fetch<Weather.Responses.GridpointForecast>({
      url: this.api('gridpoints', grid.id, `${grid.x},${grid.y}`, '/forecast'),
    })
    return base.properties.periods
  }

  async getCurrentConditions(grid: GridPoint): Promise<CurrentConditions> {
    assert(grid, 'required: "grid"')
    const base = (await this.fetch({
      url: this.api('gridpoints', grid.id, `${grid.x},${grid.y}`, '/forecast/hourly'),
    })) as Weather.Responses.GridpointForecast
    // console.log('base', base)
    const updatedOn = DateTime.fromISO(base.properties.updateTime!).toISO()
    const current = base.properties.periods![0]
    let icon = 'clear'
    const match = current.icon!.match(/land\/(.+?)\/(.+?)[?,]/)
    if (match) {
      icon = match.slice(1, 3).join('-')
    }
    return {
      updatedOn,
      condition: current.shortForecast,
      temperature: Math.floor(
        current.temperatureUnit === 'F'
          ? (current.temperature as number)
          : celsiusToFahrenheit(current.temperature as number)
      ),
      iconClass: `weather-icon wi wi-${icon}`,
    }
  }

  async getStationConditions(stationId: string): Promise<StationCondition> {
    assert(stationId, 'required: "stationId"')
    const base = await this.fetch<Weather.Responses.Observation>({
      url: this.api('stations', stationId, 'observations/latest'),
    })
    const condition = base.properties.textDescription!
    return {
      condition,
      temperature: Math.floor(celsiusToFahrenheit(base.properties.temperature?.value ?? 0)),
      iconClass: `weather-icon wi wi-${condition.toLowerCase()}`,
    }
  }

  api(...parts: string[]): string {
    return urlJoin(this.config.baseUrl, ...parts)
  }

  private async fetch<T>(params: Request | RequestInit | undefined | Partial<Request>): Promise<T> {
    const response = await fetch({
      ...params,
      headers: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Accept: 'application/json',
        'User-Agent': this.config.userAgent,
        ...params,
      },
    })
    if (!response.ok) {
      const data = await response.text()
      this.logger.error('Weather Error', response.status, data)
      throw new Error(`Weather Error ${response.status} ${data}`)
    }
    return JSON.parse(await response.json())
  }
}

function celsiusToFahrenheit(celsius: number): number {
  return celsius * 1.8 + 32
}
