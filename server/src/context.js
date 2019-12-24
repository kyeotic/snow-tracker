'use strict'

const config = require('./config')
const logger = require('./util/logger')
const lazy = require('define-lazy-prop')

module.exports = {
  wrapContext
}

function wrapContext(lambdaContext = {}, event) {
  let context = { ...lambdaContext }
  context.logger = logger

  lazy(context, 'timberline', () => {
    let { TimberlineStore } = require('./timberline/store')
    return new TimberlineStore({
      logger,
      config: config.timberline
    })
  })

  lazy(context, 'weather', () => {
    let { WeatherStore } = require('./weather/store')
    return new WeatherStore({
      logger,
      config: config.weather
    })
  })

  return context
}
