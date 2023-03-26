import { type AppContext } from './context.ts'
import { ConditionsStore } from './conditions/baseStore.ts'
import { SnowStatus } from './weather/types.ts'

export interface SnowReport {
  timberline: SnowStatus
  skiBowl: SnowStatus
  meadows: SnowStatus
}

export async function getSnowData(context: AppContext): Promise<SnowReport> {
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
