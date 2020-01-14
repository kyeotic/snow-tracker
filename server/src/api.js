'use strict'

const { ApolloServer } = require('apollo-server-lambda')
const { promisify } = require('util')

const logger = require('./util/logger')
const { wrapContext } = require('./context')
const { typeDefs, resolvers } = require('./schema')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => {
    return {
      event,
      token: event.token,
      headers: event.headers,
      app: wrapContext(context, event)
    }
  }
})

const apolloHandler = promisify(
  server.createHandler({
    cors: {
      origin: '*',
      credentials: true
    }
  })
)

async function handler(event, context) {
  logger.info(
    'Received event:',
    JSON.stringify(event, null, 2),
    JSON.stringify(context, null, 2)
  )
  let response = await apolloHandler(event, context)
  logger.debug('Response Ready', JSON.stringify(response))
  return response
}

exports.handler = logger.handler(handler)
