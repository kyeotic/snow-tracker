'use strict'

process.env.TEST = true
require('dotenv').config()
const { wrapContext } = require('../src/context')
const context = wrapContext()

async function main() {
  let { timberline } = context
  let conditions = await timberline.getCondition()
  // let conditions = await timberline.getLiftStatuses()
  console.log('result', conditions)
}

main().catch(e => console.error(e))
