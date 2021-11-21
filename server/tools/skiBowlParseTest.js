/* eslint-disable no-console */
process.env.TEST = true
require('dotenv').config()
const { wrapContext } = require('../src/context.js')
const context = wrapContext()

async function main() {
  let { skiBowl } = context
  let conditions = await skiBowl.getCondition()
  // let conditions = await skiBowl.getLiftStatuses()
  // let conditions = await skiBowl.getSnowfall()
  // let conditions = await skiBowl.getLastUpdatedTime()
  console.log('result', conditions)
}

main().catch(e => console.error(e))
