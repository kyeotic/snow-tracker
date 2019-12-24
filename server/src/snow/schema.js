'use strict'
const { GraphQLError } = require('graphql')

exports.resolvers = {
  Query: {
    async timberline(parent, {}, context) {
      const { timberline } = context.app
      console.log('gql: snowfalls')
      let [snowfalls, liftStatuses, lastUpdated] = await Promise.all([
        timberline.getSnowfall(),
        timberline.getLiftStatuses(),
        timberline.getLastUpdatedTime()
      ])
      return { snowfalls, liftStatuses, lastUpdated }
    },
    async forecast(parent, {}, context) {
      const { weather } = context.app
      console.log('gql: forecast')
      return weather.getForecast()
    }
  }
}

exports.typeDefs = `
  extend type Query {
    timberline: Timberline
    forecast: [ForecastPeriod!]!
  }

  type ForecastPeriod {
    number: Int!
    name: String!
    startTime: DateTime!
    endTime: DateTime!
    isDaytime: Boolean
    temperature: Float!
    temperatureUnit: String!
    temperatureTrend: String
    windSpeed: String!
    windDirection: String!
    icon: String!
    shortForecast: String!
    detailedForecast: String!
  }

  type Timberline {
    lastUpdated: String
    snowfalls: [Snowfall!]!
    liftStatuses: [LiftStatus!]!
  }

  type LiftStatus {
    name: String!
    status: String!
    hours: String!
  }

  type Snowfall {
    since: String!
    depth: Float!
  }
`
