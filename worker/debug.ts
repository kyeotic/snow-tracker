import { getSnowData, SnowReport } from './api'

export { type SnowReport }

export async function run() {
  try {
    console.log('running')
    const report = await getSnowData()
    console.log('report', report.meadows.lifts)
  } catch (e: any) {}
}

run()
