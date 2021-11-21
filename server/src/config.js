export default {
  weather: {
    userAgent: process.env.DOMAIN || 'KyeSnow',
    baseUrl: 'https://api.weather.gov'
  },
  timberline: {
    conditionsUrl: 'http://www.timberlinelodge.com/conditions',
    weather: {
      point: '45.3328,-121.7088',
      office: 'PQR',
      grid: {
        id: 'PQR',
        x: 141,
        y: 88
      }
    }
  },
  skiBowl: {
    conditionsUrl:
      'https://skibowl.com/news-events/conditions-and-lift-status.html',
    weather: {
      point: '45.31,-121.77',
      station: 'ODT75',
      office: 'PQR',
      grid: {
        id: 'PQR',
        x: 139,
        y: 87
      }
    }
  },
  meadows: {
    conditionsUrl: 'https://www.skihood.com/the-mountain/conditions',
    weather: {
      point: '45.34357,-121.67227',
      office: 'PQR',
      station: 'KRTX',
      grid: {
        id: 'PQR',
        x: 142,
        y: 88
      }
    }
  }
}
