import { json } from '@remix-run/deno'
import { updateSnowReport } from '../../worker/api.ts'
import { AppContext } from '../../context.ts'

export async function loader({ context }: { context: AppContext }) {
  return json(await updateSnowReport(context))
}
