'use strict'

const merge = require('deepmerge')
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json')
const { GraphQLDateTime } = require('graphql-iso-date')

const {
  typeDefs: DietLog,
  resolvers: dietLogResolvers
} = require('./diet/schema')

const Query = `
scalar JSON
scalar JSONObject
scalar DateTime

type Query {
  _empty: String
}
`

module.exports = {
  typeDefs: [Query, DietLog],
  resolvers: merge.all([
    {
      JSON: GraphQLJSON,
      JSONObject: GraphQLJSONObject,
      DateTime: GraphQLDateTime
    },
    dietLogResolvers
  ])
}
