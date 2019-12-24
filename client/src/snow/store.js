import { request } from '../http/client'

const summaryQuery = `
query {
  timberline {
    lastUpdated
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
    lastUpdated: 'Updated at 10:23 am December 24',
    snowfalls: [
      { since: 'Since 5am', depth: 0 },
      { since: 'Last 24 hrs (5am to 5am)', depth: 1 },
      { since: 'Last 72 hrs', depth: 5 },
      { since: 'Base depth at lodge', depth: 33 }
    ],
    liftStatuses: [
      { name: 'BRUNO’S', status: 'open', hours: '9:00am - 4:00pm' },
      { name: 'PUCCI', status: 'open', hours: '9:00am - 4:00pm' },
      { name: 'JEFF FLOOD', status: 'open', hours: '9:00am - 4:00pm' },
      { name: 'STORMIN’ NORMAN', status: 'open', hours: '9:00am - 3:30pm' },
      { name: 'MOLLY’S', status: 'Waiting for Snow', hours: '9:00am - 3:30pm' },
      {
        name: 'MAGIC MILE (limited, expert terrain only)',
        status: 'Coming Soon',
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
      temperature: 24,
      startTime: '2019-12-24T18:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: 'falling',
      windSpeed: '5 mph',
      icon: 'https://api.weather.gov/icons/land/day/bkn/snow,40?size=medium',
      shortForecast: 'Mostly Cloudy then Chance Light Snow',
      detailedForecast:
        'A chance of snow after 4pm. Mostly cloudy. High near 24, with temperatures falling to around 21 in the afternoon. West wind around 5 mph. Chance of precipitation is 40%. New snow accumulation of less than one inch possible.'
    },
    {
      name: 'Tonight',
      temperature: 21,
      startTime: '2019-12-25T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: 'rising',
      windSpeed: '2 to 6 mph',
      icon: 'https://api.weather.gov/icons/land/night/snow,40?size=medium',
      shortForecast: 'Chance Light Snow',
      detailedForecast:
        'A chance of snow before 9pm, then a chance of snow and patchy fog. Cloudy. Low around 21, with temperatures rising to around 23 overnight. West southwest wind 2 to 6 mph. Chance of precipitation is 40%. New snow accumulation of 1 to 2 inches possible.'
    },
    {
      name: 'Christmas Day',
      temperature: 26,
      startTime: '2019-12-25T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: 'falling',
      windSpeed: '0 to 6 mph',
      icon:
        'https://api.weather.gov/icons/land/day/snow,40/snow,30?size=medium',
      shortForecast: 'Chance Light Snow',
      detailedForecast:
        'A chance of snow before 7am, then a chance of snow and patchy fog between 7am and 4pm. Mostly cloudy. High near 26, with temperatures falling to around 24 in the afternoon. South southeast wind 0 to 6 mph. Chance of precipitation is 40%. New snow accumulation of less than half an inch possible.'
    },
    {
      name: 'Wednesday Night',
      temperature: 20,
      startTime: '2019-12-26T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '8 mph',
      icon: 'https://api.weather.gov/icons/land/night/bkn?size=medium',
      shortForecast: 'Mostly Cloudy',
      detailedForecast:
        'Mostly cloudy, with a low around 20. East wind around 8 mph.'
    },
    {
      name: 'Thursday',
      temperature: 27,
      startTime: '2019-12-26T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '8 mph',
      icon: 'https://api.weather.gov/icons/land/day/sct?size=medium',
      shortForecast: 'Mostly Sunny',
      detailedForecast:
        'Mostly sunny, with a high near 27. South southeast wind around 8 mph.'
    },
    {
      name: 'Thursday Night',
      temperature: 22,
      startTime: '2019-12-27T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '6 to 9 mph',
      icon: 'https://api.weather.gov/icons/land/night/snow,20?size=medium',
      shortForecast: 'Slight Chance Light Snow',
      detailedForecast:
        'A slight chance of snow after 10pm. Partly cloudy, with a low around 22. Chance of precipitation is 20%.'
    },
    {
      name: 'Friday',
      temperature: 31,
      startTime: '2019-12-27T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '9 mph',
      icon: 'https://api.weather.gov/icons/land/day/snow,20/sct?size=medium',
      shortForecast: 'Slight Chance Light Snow then Mostly Sunny',
      detailedForecast:
        'A slight chance of snow before 10am. Mostly sunny, with a high near 31. Chance of precipitation is 20%.'
    },
    {
      name: 'Friday Night',
      temperature: 25,
      startTime: '2019-12-28T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '8 mph',
      icon: 'https://api.weather.gov/icons/land/night/sct?size=medium',
      shortForecast: 'Partly Cloudy',
      detailedForecast: 'Partly cloudy, with a low around 25.'
    },
    {
      name: 'Saturday',
      temperature: 34,
      startTime: '2019-12-28T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '9 mph',
      icon: 'https://api.weather.gov/icons/land/day/bkn/snow?size=medium',
      shortForecast: 'Partly Sunny then Slight Chance Light Snow',
      detailedForecast:
        'A slight chance of snow after 4pm. Partly sunny, with a high near 34.'
    },
    {
      name: 'Saturday Night',
      temperature: 26,
      startTime: '2019-12-29T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '10 mph',
      icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
      shortForecast: 'Light Snow Likely',
      detailedForecast: 'Snow likely. Mostly cloudy, with a low around 26.'
    },
    {
      name: 'Sunday',
      temperature: 31,
      startTime: '2019-12-29T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '6 to 10 mph',
      icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
      shortForecast: 'Light Snow Likely',
      detailedForecast: 'Snow likely. Mostly cloudy, with a high near 31.'
    },
    {
      name: 'Sunday Night',
      temperature: 25,
      startTime: '2019-12-30T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '7 mph',
      icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
      shortForecast: 'Chance Light Snow',
      detailedForecast: 'A chance of snow. Mostly cloudy, with a low around 25.'
    },
    {
      name: 'Monday',
      temperature: 32,
      startTime: '2019-12-30T14:00:00Z',
      isDaytime: true,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '9 mph',
      icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
      shortForecast: 'Chance Light Snow',
      detailedForecast: 'A chance of snow. Partly sunny, with a high near 32.'
    },
    {
      name: 'Monday Night',
      temperature: 26,
      startTime: '2019-12-31T02:00:00Z',
      isDaytime: false,
      temperatureUnit: 'F',
      temperatureTrend: null,
      windSpeed: '12 mph',
      icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
      shortForecast: 'Chance Light Snow',
      detailedForecast: 'A chance of snow. Mostly cloudy, with a low around 26.'
    }
  ]
}

export async function getSummary() {
  let response = await request({ query: summaryQuery })
  return response.data
  // return testData
}
