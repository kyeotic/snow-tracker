import { ConditionsStore } from './conditions/baseStore'
import { init } from './context'
import { SnowStatus } from './weather/types'

const context = init()

export interface SnowReport {
  timberline: SnowStatus
  skiBowl: SnowStatus
  meadows: SnowStatus
}

export async function getSnowData(): Promise<SnowReport> {
  const [timberline, skiBowl, meadows] = await Promise.all(
    [context.timberline, context.skiBowl, context.meadows].map(getSnowStatus)
  )

  return { timberline, skiBowl, meadows }
}

async function getSnowStatus(store: ConditionsStore) {
  let [condition, snowfalls, lifts, forecast, updatedOn] = await Promise.all([
    store.getCondition(),
    store.getSnowfall(),
    store.getLifts(),
    store.getForecast(),
    store.getLastUpdatedTime(),
  ])
  return { condition, snowfalls, lifts, forecast, updatedOn }
}
