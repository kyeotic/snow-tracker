'use strict'

const config = require('./config')
const lazy = require('define-lazy-prop')

module.exports = {
  wrapContext
}

function wrapContext(lambdaContext = {}, event) {
  let context = { ...lambdaContext }

  lazy(context, 'airtable', () => {
    let { configure } = require('./airtable/client')
    return configure({ config: config.airtable })
  })

  lazy(context, 'dietStore', () => {
    let { DietStore } = require('./diet/store')
    return new DietStore({
      airtable: context.airtable,
      baseId: config.airtable.dietBaseId,
      tableName: config.airtable.dietTable
    })
  })

  return context
}
