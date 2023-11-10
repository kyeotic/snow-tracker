import config from '../config.ts'
import { getSnowData, SnowReport } from './api.ts'
import { init } from './context.ts'

export { type SnowReport }

export async function run() {
  try {
    console.log('running')
    const report = await getSnowData(init(config))
    console.log('report', report.meadows.status)
  } catch (e: any) {
    console.error('failed', e)
  }
}

run()
