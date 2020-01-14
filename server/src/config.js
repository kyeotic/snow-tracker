'use strict'

module.exports = {
  weather: {
    userAgent: process.env.DOMAIN || 'KyeSnow',
    baseUrl: 'https://api.weather.gov'
  },
  timberline: {
    conditionsUrl: 'http://www.timberlinelodge.com/conditions',
    weather: {
      point: '45.3328,-121.7088'
    }
  },
  skiBowl: {
    conditionsUrl: 'http://www.skibowl.com/winter/mt-hood-weather-conditions',
    weather: {
      point: '45.31,-121.77',
      station: 'ODT75'
    }
  }
}
