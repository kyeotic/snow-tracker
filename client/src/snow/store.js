import { useRequest } from '../http/client'
import config from '../config'

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

const testData = {
  timberline: {
    lastUpdated: 'Updated at 8:55 am December 26',
    condition: {
      temperature: 15,
      condition: 'Partly Sunny',
      iconClass: 'weather-icon wi wi-day-sunny-overcast'
    },
    snowfalls: [
      { since: 'Since 5am', depth: 0 },
      { since: 'Last 24 hrs (5am to 5am)', depth: 2 },
      { since: 'Last 72 hrs', depth: 5 },
      { since: 'Base depth at lodge', depth: 32 }
    ],
    liftStatuses: [
      { name: 'BRUNO’S', status: 'open', hours: '9:00am - 9:00pm' },
      { name: 'PUCCI', status: 'open', hours: '9:00am - 9:00pm' },
      { name: 'JEFF FLOOD', status: 'open', hours: '9:00am - 4:00pm' },
      { name: 'STORMIN’ NORMAN', status: 'open', hours: '9:00am - 3:30pm' },
      {
        name: 'MOLLY’S',
        status: 'Waiting for Snow',
        hours: '9:00am - 3:30pm'
      },
      {
        name: 'MAGIC MILE (limited, expert terrain only)',
        status: 'open',
        hours: '10:00am - 3:00pm'
      },
      {
        name: 'PALMER (limited, expert terrain only)',
        status: 'Coming Soon',
        hours: '10:00am - 2:30pm'
      }
    ]
  },
  forecast: [
    {
      name: 'Today',
      temperature: 28,
      startTime: '2019-12-26T19:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: 'falling',
      windSpeed: '3 to 10 mph',
      icon: 'https://api.weather.gov/icons/land/day/sct?size=medium',
      shortForecast: 'Mostly Sunny',
      detailedForecast:
        'Mostly sunny. High near 28, with temperatures falling to around 26 in the afternoon. West wind 3 to 10 mph.'
    },
    {
      name: 'Tonight',
      temperature: 23,
      startTime: '2019-12-27T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: 'rising',
      windSpeed: '10 to 20 mph',
      icon: 'https://api.weather.gov/icons/land/night/snow,60?size=medium',
      shortForecast: 'Light Snow Likely',
      detailedForecast:
        'Snow likely after 10pm. Mostly cloudy. Low around 23, with temperatures rising to around 25 overnight. West northwest wind 10 to 20 mph, with gusts as high as 31 mph. Chance of precipitation is 60%. New snow accumulation of 2 to 4 inches possible.'
    },
    {
      name: 'Friday',
      temperature: 28,
      startTime: '2019-12-27T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: 'falling',
      windSpeed: '10 to 18 mph',
      icon:
        'https://api.weather.gov/icons/land/day/snow,50/snow,20?size=medium',
      shortForecast: 'Chance Light Snow then Chance Snow Showers',
      detailedForecast:
        'A chance of snow before 7am, then a chance of snow showers between 7am and 4pm. Mostly cloudy. High near 28, with temperatures falling to around 26 in the afternoon. West wind 10 to 18 mph, with gusts as high as 31 mph. Chance of precipitation is 50%. New snow accumulation of 1 to 2 inches possible.'
    },
    {
      name: 'Friday Night',
      temperature: 25,
      startTime: '2019-12-28T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '6 to 15 mph',
      icon: 'https://api.weather.gov/icons/land/night/bkn?size=medium',
      shortForecast: 'Mostly Cloudy',
      detailedForecast:
        'Mostly cloudy, with a low around 25. West wind 6 to 15 mph, with gusts as high as 26 mph.'
    },
    {
      name: 'Saturday',
      temperature: 35,
      startTime: '2019-12-28T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '6 to 10 mph',
      icon: 'https://api.weather.gov/icons/land/day/bkn/snow,60?size=medium',
      shortForecast: 'Mostly Cloudy then Light Snow Likely',
      detailedForecast:
        'Snow likely after 4pm. Mostly cloudy, with a high near 35. Southwest wind 6 to 10 mph. Chance of precipitation is 60%. New snow accumulation of less than half an inch possible.'
    },
    {
      name: 'Saturday Night',
      temperature: 26,
      startTime: '2019-12-29T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '13 mph',
      icon:
        'https://api.weather.gov/icons/land/night/snow,70/snow,80?size=medium',
      shortForecast: 'Light Snow',
      detailedForecast:
        'Snow. Cloudy, with a low around 26. Chance of precipitation is 80%. New snow accumulation of 1 to 3 inches possible.'
    },
    {
      name: 'Sunday',
      temperature: 29,
      startTime: '2019-12-29T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '9 to 13 mph',
      icon:
        'https://api.weather.gov/icons/land/day/snow,80/snow,60?size=medium',
      shortForecast: 'Light Snow',
      detailedForecast:
        'Snow. Cloudy, with a high near 29. Chance of precipitation is 80%. New snow accumulation of 2 to 4 inches possible.'
    },
    {
      name: 'Sunday Night',
      temperature: 25,
      startTime: '2019-12-30T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '6 to 9 mph',
      icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
      shortForecast: 'Chance Light Snow',
      detailedForecast:
        'A chance of snow. Mostly cloudy, with a low around 25. New snow accumulation of less than half an inch possible.'
    },
    {
      name: 'Monday',
      temperature: 31,
      startTime: '2019-12-30T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '6 mph',
      icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
      shortForecast: 'Chance Light Snow',
      detailedForecast: 'A chance of snow. Mostly cloudy, with a high near 31.'
    },
    {
      name: 'Monday Night',
      temperature: 27,
      startTime: '2019-12-31T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '6 to 13 mph',
      icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
      shortForecast: 'Light Snow Likely',
      detailedForecast: 'Snow likely. Mostly cloudy, with a low around 27.'
    },
    {
      name: 'Tuesday',
      temperature: 35,
      startTime: '2019-12-31T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '13 to 20 mph',
      icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
      shortForecast: 'Light Snow Likely',
      detailedForecast: 'Snow likely. Mostly cloudy, with a high near 35.'
    },
    {
      name: 'Tuesday Night',
      temperature: 28,
      startTime: '2020-01-01T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '16 to 20 mph',
      icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
      shortForecast: 'Light Snow Likely',
      detailedForecast: 'Snow likely. Mostly cloudy, with a low around 28.'
    },
    {
      name: "New Year's Day",
      temperature: 34,
      startTime: '2020-01-01T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '13 to 16 mph',
      icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
      shortForecast: 'Chance Light Snow',
      detailedForecast: 'A chance of snow. Mostly cloudy, with a high near 34.'
    },
    {
      name: 'Wednesday Night',
      temperature: 29,
      startTime: '2020-01-02T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '9 to 14 mph',
      icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
      shortForecast: 'Chance Light Snow',
      detailedForecast: 'A chance of snow. Mostly cloudy, with a low around 29.'
    }
  ]
}

export function useSummary() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return config.isProd ? useRequest({ query: summaryQuery }) : [testData, false]
}
