'use strict'

const request = require('request-micro')
const { wrapper } = require('lambda-logger-node')
const { TimberlineParser } = require('./parser')

const _logger = Symbol('_logger')
const _parser = Symbol('_parser')

const _conditionsUrl = Symbol('_conditionsUrl')

class TimberlineStore {
  constructor({ config, logger }) {
    this[_conditionsUrl] = config.conditionsUrl
    this[_logger] = wrapper(logger)
  }

  async getCondition() {
    await this.getSource()
    return this[_parser].getCondition()
  }

  async getLiftStatuses() {
    await this.getSource()
    return this[_parser].getLiftStatuses()
  }

  async getSnowfall() {
    await this.getSource()
    return this[_parser].getSnowfall()
  }

  async getLastUpdatedTime() {
    await this.getSource()
    return this[_parser].getLastUpdatedTime()
  }

  async getSource() {
    // If set, return it
    // If its a promise from a pending run it will be awaited
    if (this[_parser]) return this[_parser]
    // Set to a promise so that it can be awaited in parallel
    this[_parser] = loadSource(this)
    // Wait for promise and assign result to store
    this[_parser] = await this[_parser]
  }
}

module.exports = {
  TimberlineStore
}

async function loadSource(store) {
  let response = await request({ url: store[_conditionsUrl] })
  if (request.isErrorStatus(response)) {
    this[_logger].error(
      'Conditions Error',
      response.statusCode,
      response.data.toString()
    )
    throw new Error(`Error getting conditions: ${response.statusCode}`)
  }
  return new TimberlineParser({ html: response.data.toString() })
}
