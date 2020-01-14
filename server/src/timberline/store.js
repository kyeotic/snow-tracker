'use strict'

const { ConditionsStore } = require('../snow/store')
const { TimberlineParser } = require('./parser')

class TimberlineStore extends ConditionsStore {
  constructor(props) {
    super({
      ...props,
      parserFactory: (...props) => new TimberlineParser(...props)
    })
  }
}

module.exports = {
  TimberlineStore
}
