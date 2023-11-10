import { start } from './runtime.ts'
import { cwd } from './path.ts'
import * as manifest from './remix.gen.ts'
import getLoadContext from './context.ts'

start({
  manifest,
  browserImportMapPath: cwd() + '/../import_map.json',
  getLoadContext,
})
