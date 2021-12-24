import config from './config.js'
import logger from './util/logger.js'
import lazy from 'define-lazy-prop'

import { WeatherStore } from './weather/store.js'
import { TimberlineStore } from './timberline/store.js'
import { SkiBowlStore } from './skiBowl/store.js'
import { MeadowsStore } from './meadows/store.js'

// eslint-disable-next-line no-unused-vars
export function wrapContext(lambdaContext = {}, event) {
  let context = { ...lambdaContext }
  context.logger = logger
  context.config = config

  lazy(context, 'weather', () => {
    return new WeatherStore({
      logger,
      config: config.weather
    })
  })

  lazy(context, 'timberline', () => {
    return new TimberlineStore({
      logger,
      config: config.timberline,
      weather: context.weather
    })
  })

  lazy(context, 'skiBowl', () => {
    return new SkiBowlStore({
      logger,
      config: config.skiBowl,
      weather: context.weather
    })
  })

  lazy(context, 'meadows', () => {
    return new MeadowsStore({
      logger,
      config: config.meadows,
      weather: context.weather
    })
  })

  return context
}
