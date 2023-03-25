import { scheduleJob } from 'node-schedule'
import { getSnowData, SnowReport } from './api'

export { type SnowReport }

export const crons = [
  // Every two minutes
  '*/2 * * * *',

  // At minute 2 past every hour from 12 through 20.
  // '*/2 12-20 * * *',

  // At every 5th minute past every hour from 0 through 12 and every hour from 20 through 23.
  // '*/5 0-12,20-23 * * *',
]

export async function run(fn: (status: SnowReport) => void) {
  console.log('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)
  fn(await getSnowData())
  console.log('first run done')

  crons.forEach((cron) => {
    console.log(`scheduling ${cron}`)
    scheduleJob(cron, async () => {
      console.log('Executing Worker Run')
      fn(await getSnowData())
    })
  })
}
