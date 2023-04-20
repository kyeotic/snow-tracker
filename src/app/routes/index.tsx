import { useEffect, useCallback, useMemo } from 'react'
import { json } from '@remix-run/deno'
import { useLoaderData, useFetcher } from '@remix-run/react'

import ErrorBoundary from '~/components/ErrorBoundary.tsx'
import SnowSummary from '~/snow/SnowSummary.tsx'
import { getSummary } from '~/snow/store.ts'
import { onVisibilityChange } from '~/util/onVisibilityChange.ts'
import { asset, css } from '../../assets.ts'
import { AppContext } from '../../context.ts'

const styles = asset('/snow.css', css)

export function links() {
  return [{ rel: 'stylesheet', href: styles.href }]
}

export async function loader({ context }: { context: AppContext }) {
  const summary = await getSummary(context)
  return json(summary)
}

export default function Index() {
  const initialData = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const data = useMemo(() => fetcher?.data || initialData, [fetcher.data])

  const refresh = useCallback(async () => {
    fetcher.submit({})
  }, [fetcher.submit])

  useEffect(() => {
    onVisibilityChange(refresh)
  }, [])

  return (
    <div>
      <SnowSummary summary={data} />
    </div>
  )
}

export { ErrorBoundary }
