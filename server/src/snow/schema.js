'use strict'
const { GraphQLError } = require('graphql')

exports.typeDefs = `
  extend type Query {
    summary: {
      snowfalls: [Snowfall!]!
      liftStauses: [LiftStatus!]!
      conditions
    }
  }

  type conditions {
    
  }

  type LiftStatus {
    name: String
    status: String
    hours: String
  }

  type Snowfall {
    since: String
    depth: Float
  }
`

exports.resolvers = {
  Query: {
    async dietLogs(parent, { id }, context) {
      let { dietStore } = context.app
      console.log('gql: getDietLogs')
      return dietStore.getAll()
    }
  }
  // DietLogSUBPROP: {
  //   async subprop(dietlog, args, { token, app }) {
  //     let {
  //       stores: { dietlogs: store },
  //       dietlogsValidation
  //     } = app
  //     let namespacedietlog = await store.getNamespacedietlog(
  //       dietlog.resource.namespace
  //     )
  //     let canRead = await dietlogsValidation.canReaddietlog(
  //       token,
  //       namespacedietlog,
  //       dietlog
  //     )
  //     return canRead ? dietlog.subprop : null
  //   }
  // }
}
