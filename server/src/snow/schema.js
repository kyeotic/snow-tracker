'use strict'
const { GraphQLError } = require('graphql')

exports.resolvers = {
  Query: {
    async snowfalls(parent, {}, context) {
      const { timberline } = context.app
      console.log('gql: snowfalls')
      return timberline.getSnowfall()
    },
    async liftStatuses(parent, {}, context) {
      const { timberline } = context.app
      console.log('gql: liftStatuses')
      return timberline.getLiftStatuses()
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
    snowfalls: [Snowfall!]!
    liftStatuses: [LiftStatus!]!
    forecast: [ForecastPeriod!]!
  }

  type ForecastPeriod {
    number: Int!
    name: String!
    startTime: DateTime!
    endTime: DateTime!
    temperature: Float!
    temperatureUnit: String!
    temperatureTrend: String
    windSpeed: String!
    windDirection: String!
    icon: String!
    shortForecast: String!
    detailedForecast: String!
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
