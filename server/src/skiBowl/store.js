'use strict'

const { ConditionsStore } = require('../snow/store')
const { SkiBowlParser } = require('./parser')

class SkiBowlStore extends ConditionsStore {
  constructor(props) {
    super({
      ...props,
      parserFactory: (...props) => new SkiBowlParser(...props)
    })
  }
  async getCondition() {
    return super.getCurrentConditions()
  }
}

module.exports = {
  SkiBowlStore
}
