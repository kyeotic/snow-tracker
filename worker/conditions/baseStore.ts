import request, { isErrorStatus } from 'request-micro'
import { wrapper, ILogger } from '../util/logger'
import { type ConditionConfig } from '../config'
import { WeatherStore } from '../weather/store'
import { Condition, Lifts, LiftStatus, Snowfall } from '../weather/types'

export interface ParserFactory {
  ({ html, logger }: { html: string; logger?: ILogger }): Parser
}

export interface Parser {
  getLiftStatuses: () => Promise<LiftStatus[]>
  getLiftUpdatedTime: () => Promise<Date | null>
  getLastUpdatedTime: () => Promise<Date | null>
  getSnowfall: () => Promise<Snowfall[]>
  getCondition: () => Promise<Condition | null>
}

export interface ParserProps {
  html: string
  logger?: ILogger
}

export class ConditionsStore {
  private config: ConditionConfig
  private logger: ILogger
  private parserFactory: ParserFactory
  private parser: Parser | undefined
  private weather: WeatherStore
  private headers: any

  constructor({
    config,
    logger,
    weather,
    parserFactory,
    headers,
  }: {
    config: ConditionConfig
    logger: ILogger
    weather: WeatherStore
    headers?: any
    parserFactory: ParserFactory
  }) {
    this.config = config
    this.logger = wrapper(logger)
    this.parserFactory = parserFactory
    this.weather = weather
    this.headers = headers
  }

  async getCondition(): Promise<Condition | null> {
    await this.getSource()
    return this.parser!!.getCondition()
  }

  async getLifts(): Promise<Lifts> {
    await this.getSource()
    const updatedOn = await this.parser!!.getLiftUpdatedTime()
    const liftStatuses = await this.parser!!.getLiftStatuses()
    return {
      updatedOn,
      liftStatuses,
    }
  }

  async getSnowfall() {
    await this.getSource()
    return this.parser!!.getSnowfall()
  }

  async getLastUpdatedTime() {
    await this.getSource()
    return this.parser!!.getLastUpdatedTime()
  }

  async getForecast() {
    try {
      this.logger.debug('forecast', this.config.weather.grid)
      return await this.weather.getForecast(this.config.weather.grid)
    } catch (e: any) {
      this.logger.error('error getting forecast', e.message, e.stack)
      return null
    }
  }

  async getStationConditions() {
    // console.log('config', this.config)
    return this.weather.getStationConditions(this.config.weather.station)
  }

  async getCurrentConditions(): Promise<Condition | null> {
    try {
      return await this.weather.getCurrentConditions(this.config.weather.grid)
    } catch (e: any) {
      this.logger.error('error getting conditions', e.message, e.stack)
      return null
    }
  }

  async getSource(): Promise<void | Parser> {
    // If set, return it
    // If its a promise from a pending run it will be awaited
    if (this.parser) return this.parser

    // Set to a promise so that it can be awaited in parallel
    // Since getSource might get hit from multiple callsites
    // before the first invocation can return
    this.parser = this.loadSource() as any
    // Wait for promise and assign result to store
    this.parser = await this.parser
    return this.parser
  }

  async loadSource(): Promise<Parser> {
    let response = await request({
      headers: this.headers,
      url: this.config.conditionsUrl,
    })
    if (isErrorStatus(response)) {
      this.logger.error(
        'Conditions Error',
        response.statusCode,
        response.data.toString(),
        this.config
      )
      throw new Error(`Error getting conditions: ${response.statusCode}`)
    }
    return this.parserFactory({ html: response.data.toString(), logger: this.logger })
  }
}
