/* eslint-disable no-unused-vars */
import type { AppContext } from '../types/context'

const testData = {
  timberline: {
    updatedOn: '2021-12-18T21:13:00.000Z',
    condition: {
      updatedOn: '2021-12-18T21:13:00.000Z',
      temperature: 32,
      condition: 'Raining',
      iconClass: 'weather-icon wi wi-rain',
    },
    snowfalls: [
      { since: 'Since 5am', depth: 0 },
      { since: 'Last 24 hrs (5am to 5am)', depth: 0 },
      { since: 'Last 72 hrs', depth: 1 },
      { since: "Base depth at the lodge at 6,000'", depth: 43 },
      { since: 'Annual snowfall calculated since Sept. 1st', depth: 121 },
    ],
    lifts: {
      updatedOn: '2021-12-18T21:13:00.000Z',
      liftStatuses: [
        { name: 'SUMMIT PASS', status: 'open', hours: '9:00am - 4:00pm' },
        { name: 'BRUNO’S', status: 'open', hours: '9:00am - 4:00pm' },
        { name: 'PUCCI', status: 'open', hours: '9:00am - 4:00pm' },
        { name: 'JEFF FLOOD', status: 'open', hours: '9:00am - 4:00pm' },
        { name: 'MOLLY’S', status: 'open', hours: '9:00am - 3:30pm' },
        { name: 'STORMIN’ NORMAN', status: 'open', hours: '9:00am - 3:30pm' },
        { name: 'MAGIC MILE', status: 'Waiting for Snow', hours: '' },
        { name: 'PALMER CAT SKI', status: 'Waiting for Snow', hours: '' },
      ],
    },
    forecast: [
      {
        name: 'This Afternoon',
        temperature: 32,
        startTime: '2021-12-18T21:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '30 to 33 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,100?size=medium',
        shortForecast: 'Heavy Snow',
        detailedForecast:
          'Snow. Cloudy, with a high near 32. West southwest wind 30 to 33 mph, with gusts as high as 52 mph. Chance of precipitation is 100%. New snow accumulation of 3 to 7 inches possible.',
      },
      {
        name: 'Tonight',
        temperature: 25,
        startTime: '2021-12-19T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '10 to 30 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,100?size=medium',
        shortForecast: 'Heavy Snow',
        detailedForecast:
          'Snow. Cloudy, with a low around 25. West southwest wind 10 to 30 mph, with gusts as high as 46 mph. Chance of precipitation is 100%. New snow accumulation of 11 to 17 inches possible.',
      },
      {
        name: 'Sunday',
        temperature: 28,
        startTime: '2021-12-19T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: 'falling',
        windSpeed: '8 to 12 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,100?size=medium',
        shortForecast: 'Heavy Snow',
        detailedForecast:
          'Snow. Cloudy. High near 28, with temperatures falling to around 25 in the afternoon. West southwest wind 8 to 12 mph, with gusts as high as 18 mph. Chance of precipitation is 100%. New snow accumulation of 13 to 19 inches possible.',
      },
      {
        name: 'Sunday Night',
        temperature: 22,
        startTime: '2021-12-20T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 to 12 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,100?size=medium',
        shortForecast: 'Snow',
        detailedForecast:
          'Snow. Cloudy, with a low around 22. South wind 6 to 12 mph, with gusts as high as 18 mph. Chance of precipitation is 100%. New snow accumulation of 10 to 16 inches possible.',
      },
      {
        name: 'Monday',
        temperature: 26,
        startTime: '2021-12-20T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 to 13 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,90/snow,80?size=medium',
        shortForecast: 'Snow',
        detailedForecast:
          'Snow. Cloudy, with a high near 26. South wind 6 to 13 mph, with gusts as high as 20 mph. Chance of precipitation is 90%. New snow accumulation of 5 to 9 inches possible.',
      },
      {
        name: 'Monday Night',
        temperature: 22,
        startTime: '2021-12-21T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '7 to 10 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,50/snow,40?size=medium',
        shortForecast: 'Chance Light Snow',
        detailedForecast:
          'A chance of snow. Mostly cloudy, with a low around 22. Chance of precipitation is 50%. New snow accumulation of 1 to 2 inches possible.',
      },
      {
        name: 'Tuesday',
        temperature: 26,
        startTime: '2021-12-21T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '8 to 13 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,50/snow,70?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Mostly cloudy, with a high near 26. Chance of precipitation is 70%. New snow accumulation of 1 to 2 inches possible.',
      },
      {
        name: 'Tuesday Night',
        temperature: 24,
        startTime: '2021-12-22T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '9 to 15 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Mostly cloudy, with a low around 24. New snow accumulation of 1 to 3 inches possible.',
      },
      {
        name: 'Wednesday',
        temperature: 25,
        startTime: '2021-12-22T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '16 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Mostly cloudy, with a high near 25. New snow accumulation of 2 to 4 inches possible.',
      },
      {
        name: 'Wednesday Night',
        temperature: 22,
        startTime: '2021-12-23T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '16 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Mostly cloudy, with a low around 22. New snow accumulation of 3 to 5 inches possible.',
      },
      {
        name: 'Thursday',
        temperature: 23,
        startTime: '2021-12-23T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '16 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Mostly cloudy, with a high near 23. New snow accumulation of 4 to 6 inches possible.',
      },
      {
        name: 'Thursday Night',
        temperature: 21,
        startTime: '2021-12-24T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '13 to 16 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Cloudy, with a low around 21. New snow accumulation of 4 to 8 inches possible.',
      },
      {
        name: 'Friday',
        temperature: 23,
        startTime: '2021-12-24T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '17 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Light Snow',
        detailedForecast:
          'Snow. Cloudy, with a high near 23. New snow accumulation of 6 to 10 inches possible.',
      },
      {
        name: 'Friday Night',
        temperature: 19,
        startTime: '2021-12-25T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '15 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Snow',
        detailedForecast:
          'Snow. Cloudy, with a low around 19. New snow accumulation of 5 to 9 inches possible.',
      },
    ],
  },
  skiBowl: {
    updatedOn: null,
    condition: {
      updatedOn: '2021-12-18T21:04:30.000Z',
      temperature: 41,
      condition: 'Light Rain',
      iconClass: 'weather-icon wi wi-day-rain',
    },
    snowfalls: [
      { since: 'Last 24 hrs', depth: 1 },
      { since: 'Last 48 hrs', depth: 5 },
      { since: 'Base Depth', depth: 49 },
    ],
    lifts: {
      updatedOn: null,
      liftStatuses: [
        { name: 'Lower Bowl', status: 'Open', hours: '9am - 10pm' },
        { name: 'Upper Bowl', status: 'Open', hours: '9am - 10pm' },
        { name: 'Multorpor', status: 'Open', hours: '9am - 10pm' },
        { name: 'Cascade', status: 'Closed', hours: 'Opening Soon' },
      ],
    },
    forecast: [
      {
        name: 'This Afternoon',
        temperature: 43,
        startTime: '2021-12-18T21:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '9 to 13 mph',
        icon: 'https://api.weather.gov/icons/land/day/rain,100?size=medium',
        shortForecast: 'Rain',
        detailedForecast:
          'Rain. Cloudy, with a high near 43. West southwest wind 9 to 13 mph, with gusts as high as 20 mph. Chance of precipitation is 100%. New rainfall amounts between a quarter and half of an inch possible.',
      },
      {
        name: 'Tonight',
        temperature: 31,
        startTime: '2021-12-19T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '1 to 13 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,100?size=medium',
        shortForecast: 'Rain And Snow',
        detailedForecast:
          'Rain before 9pm, then rain and snow between 9pm and 4am, then patchy fog and rain and snow. Cloudy, with a low around 31. West northwest wind 1 to 13 mph, with gusts as high as 20 mph. Chance of precipitation is 100%. New snow accumulation of 3 to 7 inches possible.',
      },
      {
        name: 'Sunday',
        temperature: 36,
        startTime: '2021-12-19T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '1 to 7 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,100?size=medium',
        shortForecast: 'Heavy Snow',
        detailedForecast:
          'Snow and patchy fog before 9am, then rain and snow between 9am and 4pm, then patchy fog and rain and snow. Cloudy, with a high near 36. East southeast wind 1 to 7 mph. Chance of precipitation is 100%. New snow accumulation of 3 to 7 inches possible.',
      },
      {
        name: 'Sunday Night',
        temperature: 31,
        startTime: '2021-12-20T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '3 to 9 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,100?size=medium',
        shortForecast: 'Patchy Fog',
        detailedForecast:
          'Patchy fog and rain and snow. Cloudy, with a low around 31. East southeast wind 3 to 9 mph. Chance of precipitation is 100%. New snow accumulation of 3 to 7 inches possible.',
      },
      {
        name: 'Monday',
        temperature: 35,
        startTime: '2021-12-20T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,90/snow,80?size=medium',
        shortForecast: 'Patchy Fog',
        detailedForecast:
          'Patchy fog and rain and snow. Cloudy, with a high near 35. Southeast wind around 6 mph. Chance of precipitation is 90%. New snow accumulation of less than one inch possible.',
      },
      {
        name: 'Monday Night',
        temperature: 29,
        startTime: '2021-12-21T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow,50/snow,40?size=medium',
        shortForecast: 'Patchy Fog',
        detailedForecast:
          'Patchy fog and a chance of rain and snow. Mostly cloudy, with a low around 29. Chance of precipitation is 50%. Little or no snow accumulation expected.',
      },
      {
        name: 'Tuesday',
        temperature: 35,
        startTime: '2021-12-21T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow,50/snow,70?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely and patchy fog. Mostly cloudy, with a high near 35. Chance of precipitation is 70%. New snow accumulation of less than one inch possible.',
      },
      {
        name: 'Tuesday Night',
        temperature: 30,
        startTime: '2021-12-22T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Mostly cloudy, with a low around 30. New snow accumulation of around one inch possible.',
      },
      {
        name: 'Wednesday',
        temperature: 35,
        startTime: '2021-12-22T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '5 to 12 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Light Snow',
        detailedForecast:
          'Snow. Cloudy, with a high near 35. New snow accumulation of 1 to 2 inches possible.',
      },
      {
        name: 'Wednesday Night',
        temperature: 28,
        startTime: '2021-12-23T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Mostly cloudy, with a low around 28. New snow accumulation of 2 to 4 inches possible.',
      },
      {
        name: 'Thursday',
        temperature: 34,
        startTime: '2021-12-23T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '7 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Mostly cloudy, with a high near 34. New snow accumulation of 2 to 4 inches possible.',
      },
      {
        name: 'Thursday Night',
        temperature: 29,
        startTime: '2021-12-24T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Light Snow Likely',
        detailedForecast:
          'Snow likely. Cloudy, with a low around 29. New snow accumulation of 3 to 5 inches possible.',
      },
      {
        name: 'Friday',
        temperature: 32,
        startTime: '2021-12-24T14:00:00Z',
        isDaytime: true,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '6 mph',
        icon: 'https://api.weather.gov/icons/land/day/snow?size=medium',
        shortForecast: 'Light Snow',
        detailedForecast:
          'Snow. Cloudy, with a high near 32. New snow accumulation of 3 to 7 inches possible.',
      },
      {
        name: 'Friday Night',
        temperature: 26,
        startTime: '2021-12-25T02:00:00Z',
        isDaytime: false,
        temperatureUnit: 'F',
        temperatureTrend: null,
        windSpeed: '7 mph',
        icon: 'https://api.weather.gov/icons/land/night/snow?size=medium',
        shortForecast: 'Light Snow',
        detailedForecast:
          'Snow. Cloudy, with a low around 26. New snow accumulation of 3 to 7 inches possible.',
      },
    ],
  },
  meadows: {
    updatedOn: '2021-12-18T21:30:00.000Z',
    condition: {
      updatedOn: '2021-12-18T21:30:00.000Z',
      temperature: 34,
      condition: 'Drizzle',
      iconClass: 'weather-icon wi wi-day-light-rain',
    },
    snowfalls: [
      { since: 'Base Depth', depth: 45 },
      { since: 'Mid Depth', depth: 54 },
      { since: '12hr', depth: 1 },
      { since: '24hr', depth: 1 },
      { since: '48hr', depth: 3 },
    ],
    lifts: {
      updatedOn: '2021-12-18T19:54:00.000Z',
      liftStatuses: [
        { name: 'Buttercup', status: 'Open', hours: '9am-9pm' },
        { name: 'Easy Rider', status: 'Open', hours: '9am-9pm' },
        { name: 'Vista Express', status: 'Closed', hours: 'Closed' },
        { name: 'Cascade Express', status: 'Closed', hours: 'Closed' },
        { name: 'Daisy', status: 'Standby', hours: '9am-4pm, As Needed' },
        { name: 'Mt Hood Express', status: 'Open', hours: '9am-9pm' },
        { name: 'Blue', status: 'Closed', hours: 'Closed' },
        { name: 'Stadium Express', status: 'Open', hours: '9am-4pm, As Needed' },
        { name: 'Shooting Star Express', status: 'Open', hours: '9am-4pm' },
        { name: 'Hood River Express', status: 'Open', hours: '9am-4pm' },
        { name: 'Heather Canyon', status: 'Closed', hours: 'Closed' },
        { name: 'Ballroom Carpet', status: 'Open', hours: '9am-9pm' },
      ],
    },
    forecast: null,
  },
}

export async function getSummary({ snow }: AppContext, { debug = false } = {}) {
  if (debug) return testData

  console.log('getting from KV')
  const data = await snow.get('conditions')
  const list = await snow.list()

  console.log('data', data, list)

  if (!data) throw new Error('KV Conditions missing')
  return JSON.parse(data).data
}
