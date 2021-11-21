import { graphql } from 'graphql'
import { Router } from 'lambda-router'

import logger from './util/logger.js'
import { wrapContext } from './context.js'
import { schema } from './schema.js'

const includeErrorStack = true
const router = Router({
  logger,
  trimTrailingSlash: true,
  assumeJson: true,
  includeErrorStack
})

const graphQlHandler = makeGraphQlHandler(schema)

// Routes
router.get('/v1/graphql', graphQlHandler)
router.post('/v1/graphql', graphQlHandler)

// Handlers
function makeGraphQlHandler(schema) {
  return async (event, context) => {
    logger.info('body', event.body)
    // logger.info('body schema', schema)
    const queryResult = await graphql({
      schema,
      source: event.body.query,
      rootValue: undefined,
      contextValue: {
        event,
        token: event.token,
        headers: event.headers,
        app: context
      }
    })
    // logger.info('queryResult', queryResult)
    if (queryResult.errors) {
      queryResult.errors.forEach(err => {
        logger.error(err.stack)
        if (includeErrorStack) {
          Object.defineProperty(err, 'stack', {
            value: err.stack,
            writable: true,
            enumerable: true,
            configurable: true
          })
        }
      })
    }
    return queryResult
  }
}

async function handler(event, context) {
  logger.info('Received event:', JSON.stringify(event, null, 2))
  logger.debug('Event content', JSON.stringify(context, null, 2))

  context = wrapContext(context, event)

  let result = await router.route(event, context)

  return result.response
}

const apiHandler = logger.handler(handler)

export { apiHandler as handler }
