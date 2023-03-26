import type config from '../config.ts'
import { MeadowsStore } from './conditions/meadows.ts'
import { SkiBowlStore } from './conditions/skiBowl.ts'
import { TimberlineStore } from './conditions/timberline.ts'
import { ILogger, wrapper } from './util/logger.ts'
import { WeatherStore } from './weather/store.ts'

export type AppConfig = typeof config

export interface AppContext {
  config: AppConfig
  logger: ILogger
  weather: WeatherStore
  timberline: TimberlineStore
  skiBowl: SkiBowlStore
  meadows: MeadowsStore
}

export function init(config: AppConfig) {
  const context = {} as Partial<AppContext>
  context.logger = wrapper({ minimumLogLevel: 'INFO' })
  context.config = config

  context.weather = new WeatherStore({ logger: context.logger, config: config.weather })

  context.timberline = new TimberlineStore({
    logger: context.logger,
    config: config.timberline,
    weather: context.weather,
  })

  context.skiBowl = new SkiBowlStore({
    logger: context.logger,
    config: config.skiBowl,
    weather: context.weather,
  })

  context.meadows = new MeadowsStore({
    logger: context.logger,
    config: config.meadows,
    weather: context.weather,
  })

  return context as AppContext
}
