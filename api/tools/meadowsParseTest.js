import { wrapContext } from '../src/context.js'
import dotenv from 'dotenv'
dotenv.config()

const context = wrapContext()

async function main() {
  let { meadows } = context
  // let conditions = await meadows.getCondition()
  let conditions = await meadows.getSnowfall()
  // let conditions = await meadows.getLiftStatuses()
  // let conditions = await meadows.getForecast()
  // let conditions = await meadows.getLastUpdatedTime()
  console.log('result', conditions)
}

main().catch(e => console.error(e))
