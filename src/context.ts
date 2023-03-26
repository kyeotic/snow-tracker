import config from './config.ts'
import { init, type AppContext } from './worker/context.ts'

export type { AppContext }

export default async function getLoadContext(request: Request): Promise<AppContext> {
  return init(config)
}
