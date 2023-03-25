export interface ConditionConfig {
  conditionsUrl: string
  weather: {
    station: string
    point: string
    office: string
    grid: {
      id: string
      x: number
      y: number
    }
  }
}

export interface GridPoint {
  id: string
  x: number
  y: number
}

const config = {
  timeZone: 'America/Los_Angeles' as string,
  weather: {
    userAgent: (process.env.DOMAIN || 'KyeSnow') as string,
    baseUrl: 'https://api.weather.gov' as string,
  },
  timberline: {
    conditionsUrl: 'http://www.timberlinelodge.com/conditions',
    weather: {
      point: '45.3328,-121.7088',
      office: 'PQR',
      grid: {
        id: 'PQR',
        x: 141,
        y: 88,
      } as GridPoint,
    },
  } as ConditionConfig,
  skiBowl: {
    conditionsUrl: 'https://skibowl.com/news-events/conditions-and-lift-status.html',
    weather: {
      point: '45.31,-121.77',
      station: 'ODT75',
      office: 'PQR',
      grid: {
        id: 'PQR',
        x: 139,
        y: 87,
      } as GridPoint,
    },
  } as ConditionConfig,
  meadows: {
    conditionsUrl: 'https://www.skihood.com/the-mountain/conditions',
    weather: {
      point: '45.34357,-121.67227',
      office: 'PQR',
      station: 'KRTX',
      grid: {
        id: 'PQR',
        x: 143,
        y: 88,
      } as GridPoint,
    },
  } as ConditionConfig,
} as const

export default config
export type WeatherConfig = (typeof config)['weather']
