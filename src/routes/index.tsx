import { RouteContext } from '$fresh/server.ts'
import SnowSummary from '../islands/SnowSummary.tsx'
import config from '../config.ts'
import { getSnowData } from '../worker/api.ts'
import { init } from '../worker/context.ts'

export default async function Home(_req: Request, ctx: RouteContext) {
  const appContext = init(config)
  const status = await getSnowData(appContext)

  return (
    <div>
      <SnowSummary summary={status} config={config} />
    </div>
  )
}
