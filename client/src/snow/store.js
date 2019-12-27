import { useRequest } from '../http/client'

const summaryQuery = `
query {
  timberline {
    lastUpdated
    condition {
      temperature
      condition
      iconClass
    }
    snowfalls {
      since
      depth
    }
    liftStatuses {
      name
      status
      hours
    }
  }
  forecast {
    name
    temperature
    startTime
    isDaytime
    temperatureUnit
    temperatureTrend
    windSpeed
    icon
    shortForecast
    detailedForecast
  }
}
`

export function useSummary() {
  return useRequest({ query: summaryQuery })
}
