import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json'
import isoDate from 'graphql-iso-date'
import {
  typeDefs as SnowTypes,
  resolvers as snowResolvers
} from './snow/schema.js'

const { GraphQLDateTime } = isoDate

const Query = `
scalar JSON
scalar JSONObject
scalar DateTime

type Query {
  _empty: String
}
`

export const typeDefs = [Query, SnowTypes]
export const resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  DateTime: GraphQLDateTime,
  ...snowResolvers
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
