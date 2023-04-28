import { type ConditionConfig, type GridPoint } from './worker/weather/types.ts'

const timeZone = 'America/Los_Angeles' as string
const config = {
  timeZone,
  weather: {
    userAgent: (Deno.env.get('DOMAIN') ?? 'snow.kye.dev') as string,
    baseUrl: 'https://api.weather.gov' as string,
  },
  timberline: {
    timeZone,
    conditionsUrl: 'http://www.timberlinelodge.com/conditions',
    noaaUrl:
      'https://forecast.weather.gov/MapClick.php?lat=45.33284041773058&lon=-121.70877456665039&site=all',
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
    timeZone,
    conditionsUrl: 'http://www.skibowl.com/winter/mt-hood-weather-conditions',
    noaaUrl: 'https://forecast.weather.gov/MapClick.php?lat=45.302189&lon=-121.750504&site=all',
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
    timeZone,
    conditionsUrl: 'https://www.skihood.com/the-mountain/conditions',
    noaaUrl: 'https://forecast.weather.gov/MapClick.php?lat=45.3282&lon=-121.6623',
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
