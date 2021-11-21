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
    }
  }
}

async function getSnowStatus(store) {
  let [
    condition,
    snowfalls,
    liftStatuses,
    lastUpdated,
    forecast
  ] = await Promise.all([
    store.getCondition(),
    store.getSnowfall(),
    store.getLiftStatuses(),
    store.getLastUpdatedTime(),
    store.getForecast()
  ])
  // console.log('snow status', {
  //   condition,
  //   snowfalls,
  //   liftStatuses,
  //   lastUpdated,
  //   forecast
  // })
  return { condition, snowfalls, liftStatuses, lastUpdated, forecast }
}

export const typeDefs = `
  extend type Query {
    timberline: SnowStatus
    skiBowl: SnowStatus
  }

  type SnowStatus {
    lastUpdated: String
    snowfalls: [Snowfall!]!
    liftStatuses: [LiftStatus!]!
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
    temperature: Float!
    condition: String
    iconClass: String
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
