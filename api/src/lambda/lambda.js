'use strict'

// eslint-disable-next-line import/extensions
// const { handler } = require('../api')

// exports.handler = handler

exports.handler = async (event, context) => {
  const { handler } = await import('../api.js')
  return handler(event, context)
}
