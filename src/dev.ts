import { dev } from './runtime.ts'
import { cwd } from './path.ts'
import getLoadContext from './context.ts'

dev({
  browserImportMapPath: cwd() + '/../import_map_dev.json',
  getLoadContext,
})
