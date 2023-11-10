import { type AppContext } from './context.ts'
import { SnowStatus } from './weather/types.ts'
import { DateTime } from 'luxon'

export interface SnowReport {
  timberline: SnowStatus
  skiBowl: SnowStatus
  meadows: SnowStatus
}

export async function getSnowData(context: AppContext): Promise<SnowReport> {
  let [timberline, skiBowl, meadows] = await Promise.all([
    context.snow.get('timberline'),
    context.snow.get('skiBowl'),
    context.snow.get('meadows'),
  ])

  if (isStale(timberline, skiBowl, meadows)) {
    // console.log('refetching')
    const update = await updateSnowReport(context)
    timberline = update.timberline
    skiBowl = update.skiBowl
    meadows = update.meadows
  }

  // isStale asserts non-null, so here we should have a value
  return { timberline: timberline!, skiBowl: skiBowl!, meadows: meadows! }
}

export async function updateSnowReport(context: AppContext): Promise<SnowReport> {
  const report = await fetchSnowData(context)
  await Promise.all([
    context.snow.put('timberline', report.timberline),
    context.snow.put('skiBowl', report.skiBowl),
    context.snow.put('meadows', report.meadows),
  ])
  return report
}

export async function fetchSnowData(context: AppContext): Promise<SnowReport> {
  const [timberline, skiBowl, meadows] = await Promise.all(
    [context.timberline, context.skiBowl, context.meadows].map((store) => store.getStatus()),
  )

  return { timberline, skiBowl, meadows }
}

function isStale(...statuses: (SnowStatus | null)[]): boolean {
  return statuses.some((s) => {
    if (!s?.checkedOn) return true
    return Math.abs(DateTime.fromISO(s.checkedOn).diffNow('minutes').minutes) > 5
  })
}
