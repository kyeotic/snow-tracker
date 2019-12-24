'use strict'

module.exports = {
  weather: {
    userAgent: process.env.DOMAIN || 'KyeSnow',
    baseUrl: 'https://api.weather.gov/points/45.3328,-121.7088'
  },
  timberline: {
    conditionsUrl: 'http://www.timberlinelodge.com/conditions'
  }
}
