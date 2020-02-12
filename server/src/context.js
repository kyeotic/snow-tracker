'use strict'

const config = require('./config')
const logger = require('./util/logger')
const lazy = require('define-lazy-prop')

module.exports = {
  wrapContext
}

// eslint-disable-next-line no-unused-vars
function wrapContext(lambdaContext = {}, event) {
  let context = { ...lambdaContext }
  context.logger = logger
  context.config = config

  lazy(context, 'weather', () => {
    const { WeatherStore } = require('./weather/store')
    return new WeatherStore({
      logger,
      config: config.weather
    })
  })

  lazy(context, 'timberline', () => {
    const { TimberlineStore } = require('./timberline/store')
    return new TimberlineStore({
      logger,
      config: config.timberline,
      weather: context.weather
    })
  })

  lazy(context, 'skiBowl', () => {
    const { SkiBowlStore } = require('./skiBowl/store')
    return new SkiBowlStore({
      logger,
      config: config.skiBowl,
      weather: context.weather
    })
  })

  return context
}
