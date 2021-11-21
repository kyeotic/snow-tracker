import { wrapContext } from '../src/context.js'
import dotenv from 'dotenv'
dotenv.config()

const context = wrapContext()

async function main() {
  let { timberline } = context
  // let conditions = await timberline.getCondition()
  // let conditions = await timberline.getLiftStatuses()
  let conditions = await timberline.getForecast()
  console.log('result', conditions)
}

main().catch(e => console.error(e))
