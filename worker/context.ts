import { MeadowsStore } from './conditions/meadows'
import { SkiBowlStore } from './conditions/skiBowl'
import { TimberlineStore } from './conditions/timberline'
import config from './config'
import { ILogger, wrapper } from './util/logger'
import { WeatherStore } from './weather/store'

export interface AppContext {
  logger: ILogger
  config: typeof config
  weather: WeatherStore
  timberline: TimberlineStore
  skiBowl: SkiBowlStore
  meadows: MeadowsStore
}

export function init() {
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
