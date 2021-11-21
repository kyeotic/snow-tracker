/* eslint-disable no-unused-vars */
import { useRequest } from '../http/client.js'
import config from '../config.js'

const summaryQuery = `
query {
  timberline {
    ...summary
  }
  skiBowl {
    ...summary
  }
}
fragment summary on SnowStatus {
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
    lastUpdated: 'Updated at 3:55 pm January 13',
    condition: {
      temperature: 20,
      condition: 'Snowing',
      iconClass: 'weather-icon wi wi-snow',
    },
    snowfalls: [
      {
        since: 'Since 5am',
        depth: 3,
      },
      {
        since: 'Last 24 hrs (5am to 5am)',
        depth: 14,
      },
      {
        since: 'Last 72 hrs',
        depth: 39,
      },
      {
        since: 'Base depth at lodge',
        depth: 109,
      },
    ],
    liftStatuses: [
      {
        name: "BRUNO'S",
        status: 'Scheduled to Operate',
        hours: '9:00am - 4:00pm',
      },
      {
        name: 'PUCCI',
        status: 'Scheduled to Operate',
        hours: '9:00am - 4:00pm',
      },
      {
        name: 'JEFF FLOOD',
        status: 'Scheduled to Operate',
        hours: '9:00am - 4:00pm',
      },
      {
        name: "STORMIN' NORMAN",
        status: 'Scheduled to Operate',
        hours: '9:00am - 3:30pm',
      },
      {
        name: "MOLLY'S",
        status: 'Scheduled to Operate',
        hours: '9:00am - 3:30pm',
      },
      {
        name: 'MAGIC MILE',
        status: 'Closed for the Day',
        hours: '9:00am - 3:00pm',
      },
      {
        name: 'PALMER CAT SKI (weekends only)',
        status: 'Closed for the Day',
        hours: '10:00am - 2:00pm',
      },
    ],
    forecast: [
      {
        name: 'Tonight',
        temperature: 12,
        startTime: '2020-01-14T06:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: 'rising',
        windSpeed: '18 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,100?size=medium',
        shortForecast: 'Snow Showers',
        detailedForecast:
          'Snow showers. Cloudy. Low around 12, with temperatures rising to around 14 overnight. Wind chill values as low as -6. West wind around 18 mph, with gusts as high as 31 mph. Chance of precipitation is 100%. New snow accumulation of 6 to 10 inches possible.',
      },
      {
        name: 'Tuesday',
        temperature: 16,
        startTime: '2020-01-14T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: 'falling',
        windSpeed: '21 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,100?size=medium',
        shortForecast: 'Snow Showers',
        detailedForecast:
          'Snow showers. Cloudy. High near 16, with temperatures falling to around 14 in the afternoon. Wind chill values as low as -7. West southwest wind around 21 mph, with gusts as high as 33 mph. Chance of precipitation is 100%. New snow accumulation of 6 to 10 inches possible.',
      },
      {
        name: 'Tuesday Night',
        temperature: 8,
        startTime: '2020-01-15T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 to 20 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,60/snow,20?size=medium',
        shortForecast: 'Snow Showers Likely then Slight Chance Light Snow',
        detailedForecast:
          'Snow showers likely before 10pm, then a slight chance of snow. Mostly cloudy, with a low around 8. Wind chill values as low as -9. Southwest wind 6 to 20 mph, with gusts as high as 30 mph. Chance of precipitation is 60%. New snow accumulation of 1 to 3 inches possible.',
      },
      {
        name: 'Wednesday',
        temperature: 21,
        startTime: '2020-01-15T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 to 17 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,50/snow,70?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Mostly cloudy, with a high near 21. South southeast wind 6 to 17 mph, with gusts as high as 30 mph. Chance of precipitation is 70%. New snow accumulation of 1 to 3 inches possible.',
      },
      {
        name: 'Wednesday Night',
        temperature: 11,
        startTime: '2020-01-16T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '17 to 21 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,70?size=medium',
        shortForecast: 'Light Snow Likely then Snow Showers Likely',
        detailedForecast:
          'Snow likely before 10pm, then snow showers likely. Cloudy, with a low around 11. South southeast wind 17 to 21 mph, with gusts as high as 33 mph. Chance of precipitation is 70%. New snow accumulation of 3 to 5 inches possible.',
      },
      {
        name: 'Thursday',
        temperature: 21,
        startTime: '2020-01-16T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '13 to 21 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,70?size=medium',
        shortForecast: 'Snow Showers Likely then Light Snow Likely',
        detailedForecast:
          'Snow showers likely before 10am, then snow likely. Cloudy, with a high near 21. Chance of precipitation is 70%. New snow accumulation of 2 to 4 inches possible.',
      },
      {
        name: 'Thursday Night',
        temperature: 17,
        startTime: '2020-01-17T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '14 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,70?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Mostly cloudy, with a low around 17. Chance of precipitation is 70%. New snow accumulation of 1 to 3 inches possible.',
      },
      {
        name: 'Friday',
        temperature: 24,
        startTime: '2020-01-17T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '13 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Cloudy, with a high near 24. New snow accumulation of less than one inch possible.',
      },
      {
        name: 'Friday Night',
        temperature: 23,
        startTime: '2020-01-18T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '13 to 17 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Light Snow',
        detailedForecast: 'Snow. Cloudy, with a low around 23.',
      },
      {
        name: 'Saturday',
        temperature: 27,
        startTime: '2020-01-18T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '12 to 17 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Light Snow',
        detailedForecast:
          'Snow before 4pm, then snow showers likely. Cloudy, with a high near 27.',
      },
      {
        name: 'Saturday Night',
        temperature: 22,
        startTime: '2020-01-19T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '12 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Snow Showers Likely',
        detailedForecast:
          'Snow showers likely. Mostly cloudy, with a low around 22.',
      },
      {
        name: 'Sunday',
        temperature: 29,
        startTime: '2020-01-19T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '12 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Chance Snow Showers',
        detailedForecast:
          'A chance of snow showers. Partly sunny, with a high near 29.',
      },
      {
        name: 'Sunday Night',
        temperature: 22,
        startTime: '2020-01-20T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '10 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Chance Snow Showers',
        detailedForecast:
          'A chance of snow showers before 4am, then a chance of snow. Cloudy, with a low around 22.',
      },
      {
        name: 'M.L. King Jr. Day',
        temperature: 28,
        startTime: '2020-01-20T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '10 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Chance Light Snow',
        detailedForecast: 'A chance of snow. Cloudy, with a high near 28.',
      },
    ],
  },
  skiBowl: {
    lastUpdated: 'Jan 13 2020 - 08:30:01 PM ',
    condition: {
      temperature: 25,
      condition: 'Snow Showers',
      iconClass: 'weather-icon wi wi-night-snow',
    },
    snowfalls: [
      {
        since: 'Last 24 hrs',
        depth: 10,
      },
      {
        since: 'Last 72 hrs',
        depth: 44,
      },
      {
        since: 'Base Depth',
        depth: 42,
      },
    ],
    liftStatuses: [
      {
        name: 'Lower Bowl',
        status: 'Open',
        hours: '3:00pm-10:00pm',
      },
      {
        name: 'Upper Bowl',
        status: 'Open',
        hours: '3:00pm-9:45pm',
      },
      {
        name: 'Multorpor',
        status: 'Open',
        hours: '3:00pm-10:00pm',
      },
      {
        name: 'Cascade',
        status: 'Closed',
        hours: 'Saturday/Sunday',
      },
    ],
    forecast: [
      {
        name: 'Tonight',
        temperature: 21,
        startTime: '2020-01-14T06:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: 'rising',
        windSpeed: '15 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,100?size=medium',
        shortForecast: 'Snow Showers',
        detailedForecast:
          'Snow showers. Cloudy. Low around 21, with temperatures rising to around 23 overnight. West wind around 15 mph, with gusts as high as 25 mph. Chance of precipitation is 100%. New snow accumulation of 5 to 9 inches possible.',
      },
      {
        name: 'Tuesday',
        temperature: 24,
        startTime: '2020-01-14T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: 'falling',
        windSpeed: '16 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,100?size=medium',
        shortForecast: 'Snow Showers',
        detailedForecast:
          'Snow showers. Cloudy. High near 24, with temperatures falling to around 20 in the afternoon. West wind around 16 mph, with gusts as high as 28 mph. Chance of precipitation is 100%. New snow accumulation of 4 to 8 inches possible.',
      },
      {
        name: 'Tuesday Night',
        temperature: 16,
        startTime: '2020-01-15T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '5 to 14 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,60/snow,20?size=medium',
        shortForecast: 'Snow Showers Likely then Slight Chance Light Snow',
        detailedForecast:
          'Snow showers likely before 10pm, then a slight chance of snow. Mostly cloudy, with a low around 16. West southwest wind 5 to 14 mph, with gusts as high as 21 mph. Chance of precipitation is 60%. New snow accumulation of around one inch possible.',
      },
      {
        name: 'Wednesday',
        temperature: 23,
        startTime: '2020-01-15T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '8 to 21 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,50/snow,70?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Mostly cloudy, with a high near 23. East southeast wind 8 to 21 mph, with gusts as high as 32 mph. Chance of precipitation is 70%. New snow accumulation of 1 to 3 inches possible.',
      },
      {
        name: 'Wednesday Night',
        temperature: 20,
        startTime: '2020-01-16T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '10 to 21 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,70/snow,60?size=medium',
        shortForecast: 'Light Snow Likely then Snow Showers Likely',
        detailedForecast:
          'Snow likely before 10pm, then snow showers likely. Cloudy, with a low around 20. South southeast wind 10 to 21 mph, with gusts as high as 32 mph. Chance of precipitation is 70%. New snow accumulation of 2 to 4 inches possible.',
      },
      {
        name: 'Thursday',
        temperature: 29,
        startTime: '2020-01-16T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '7 to 14 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,70?size=medium',
        shortForecast: 'Snow Showers Likely then Light Snow Likely',
        detailedForecast:
          'Snow showers likely before 10am, then snow likely. Cloudy, with a high near 29. Chance of precipitation is 70%. New snow accumulation of 1 to 3 inches possible.',
      },
      {
        name: 'Thursday Night',
        temperature: 24,
        startTime: '2020-01-17T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '7 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,70?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Cloudy, with a low around 24. Chance of precipitation is 70%. New snow accumulation of 1 to 3 inches possible.',
      },
      {
        name: 'Friday',
        temperature: 32,
        startTime: '2020-01-17T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '7 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Cloudy, with a high near 32. New snow accumulation of less than one inch possible.',
      },
      {
        name: 'Friday Night',
        temperature: 29,
        startTime: '2020-01-18T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '8 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Light Snow',
        detailedForecast: 'Snow. Cloudy, with a low around 29.',
      },
      {
        name: 'Saturday',
        temperature: 35,
        startTime: '2020-01-18T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '8 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Light Snow',
        detailedForecast:
          'Snow before 4pm, then snow showers likely. Cloudy, with a high near 35.',
      },
      {
        name: 'Saturday Night',
        temperature: 30,
        startTime: '2020-01-19T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '3 to 7 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Snow Showers Likely',
        detailedForecast:
          'Snow showers likely. Mostly cloudy, with a low around 30.',
      },
      {
        name: 'Sunday',
        temperature: 37,
        startTime: '2020-01-19T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '7 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Chance Snow Showers',
        detailedForecast:
          'A chance of snow showers. Partly sunny, with a high near 37.',
      },
      {
        name: 'Sunday Night',
        temperature: 29,
        startTime: '2020-01-20T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Chance Snow Showers',
        detailedForecast:
          'A chance of snow showers before 4am, then a chance of snow. Cloudy, with a low around 29.',
      },
      {
        name: 'M.L. King Jr. Day',
        temperature: 36,
        startTime: '2020-01-20T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Chance Light Snow',
        detailedForecast: 'A chance of snow. Cloudy, with a high near 36.',
      },
    ],
  },
}

export function useSummary() {
  // return config.isProd ? useRequest({ query: summaryQuery }) : [testData, false]
  return useRequest({ query: summaryQuery })
}
