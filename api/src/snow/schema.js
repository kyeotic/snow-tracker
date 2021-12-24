// const { GraphQLError } = require('graphql')

export const resolvers = {
  Query: {
    async timberline(parent, _, context) {
      const { timberline, logger } = context.app
      logger.info('gql: Timberline')
      return getSnowStatus(timberline)
    },
    async skiBowl(parent, _, context) {
      const { skiBowl, logger } = context.app
      logger.info('gql: Ski Bowl')
      return getSnowStatus(skiBowl)
    },
    async meadows(parent, _, context) {
      const { meadows, logger } = context.app
      logger.info('gql: Ski Bowl')
      return getSnowStatus(meadows)
    },
  },
}

async function getSnowStatus(store) {
  let [condition, snowfalls, lifts, forecast, updatedOn] = await Promise.all([
    store.getCondition(),
    store.getSnowfall(),
    store.getLifts(),
    store.getForecast(),
    store.getLastUpdatedTime(),
  ])
  return { condition, snowfalls, lifts, forecast, updatedOn }
}

export const typeDefs = `
  extend type Query {
    timberline: SnowStatus
    skiBowl: SnowStatus
    meadows: SnowStatus
  }

  type SnowStatus {
    updatedOn: DateTime
    snowfalls: [Snowfall!]!
    lifts: Lifts!
    condition: Condition
    forecast: [ForecastPeriod!]
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

  type Condition {
    updatedOn: DateTime
    temperature: Float!
    condition: String
    iconClass: String
  }

  type Lifts {
    updatedOn: DateTime
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