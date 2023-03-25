import { useEffect, useCallback, useMemo } from 'react'
import { json, type LoaderArgs } from '@remix-run/deno'
import { useLoaderData, useNavigation, useFetcher } from '@remix-run/react'

import SnowSummary from '../snow/SnowSummary.tsx'
import { getSummary } from '../snow/store.ts'
import { onVisibilityChange } from '../util/onVisibilityChange.ts'
import { asset, css } from '../../assets.ts'

const styles = asset('/snow.css', css)

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export async function loader({ context }: { context: any }) {
  const summary = await getSummary(context)
  return json(summary, {
    // headers: cacheControl({ maxAge: defaultCacheTime, swr: defaultSwrTime }),
  })
}

export default function Index() {
  const initialData = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const data = useMemo(() => fetcher?.data || initialData, [fetcher.data])

  const refresh = useCallback(async () => {
    fetcher.submit({})
  }, [fetcher.submit])

  const transition = useNavigation()
  const isLoading = transition.state === 'loading' || fetcher.state === 'submitting'

  useEffect(() => {
    onVisibilityChange(refresh)
  }, [])

  return (
    <div>
      <SnowSummary summary={data} />
    </div>
  )
}
