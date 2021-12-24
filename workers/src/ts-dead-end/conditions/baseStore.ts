// import { wrapper, Logger } from '../util/logger'

// import type { WeatherStore } from '../weather/store'
// import type { Parser, ParserFactory } from './types'

// export const _config = Symbol('_config')
// export const _logger = Symbol('_logger')
// export const _parser = Symbol('_parser')
// export const _weather = Symbol('_weather')

// export const _parserFactory = Symbol('_parserFactory')
// export const _headers = Symbol('_headers')

// interface ConditionConfig {
//   conditionsUrl: string
//   weather: {
//     point: string
//     station: string
//     office: string
//     grid: {
//       id: string
//       x: number
//       y: number
//     }
//   }
// }

// export class ConditionsStore {
//   private config: ConditionConfig
//   private logger: Logger
//   private parserFactory: ParserFactory
//   private weather: WeatherStore
//   private headers?: Record<string, string>
//   constructor({
//     config,
//     logger,
//     weather,
//     parser,
//     headers,
//   }: {
//     config: ConditionConfig
//     logger?: Logger
//     weather: WeatherStore
//     headers: Record<string, string>
//     parserFactory: ParserFactory
//   }) {
//     this.config = config
//     this.logger = wrapper(logger)
//     this.parserFactory = parserFactory
//     this.weather = weather
//     this.headers = headers
//   }

//   async getCondition() {
//     await this.getSource()
//     return this[_parser].getCondition()
//   }

//   async getLifts() {
//     await this.getSource()
//     const updatedOn = this[_parser].getLiftUpdatedTime()
//     const liftStatuses = this[_parser].getLiftStatuses()
//     return {
//       updatedOn,
//       liftStatuses,
//     }
//   }

//   async getSnowfall() {
//     await this.getSource()
//     return this[_parser].getSnowfall()
//   }

//   async getLastUpdatedTime() {
//     await this.getSource()
//     return this[_parser].getLastUpdatedTime()
//   }

//   async getForecast() {
//     try {
//       return await this[_weather].getForecast(this[_config].weather.grid)
//     } catch (e) {
//       this[_logger].error('error getting forecast', e.message, e.stack)
//       return null
//     }
//   }

//   async getStationConditions() {
//     // console.log('config', this[_config])
//     return this[_weather].getStationConditions(this[_config].weather.station)
//   }

//   async getCurrentConditions() {
//     try {
//       return await this[_weather].getCurrentConditions(this[_config].weather.grid)
//     } catch (e) {
//       this[_logger].error('error getting conditions', e.message, e.stack)
//       return null
//     }
//   }

//   async getSource() {
//     // If set, return it
//     // If its a promise from a pending run it will be awaited
//     if (this[_parser]) return this[_parser]
//     // Set to a promise so that it can be awaited in parallel
//     this[_parser] = loadSource(this)
//     // Wait for promise and assign result to store
//     this[_parser] = await this[_parser]
//   }
// }

// async function loadSource(store) {
//   let response = await request({
//     headers: store[_headers],
//     url: store[_config].conditionsUrl,
//   })
//   if (request.isErrorStatus(response)) {
//     store[_logger].error('Conditions Error', response.statusCode, response.data.toString())
//     throw new Error(`Error getting conditions: ${response.statusCode}`)
//   }
//   return store[_parserFactory]({ html: response.data.toString() })
// }
