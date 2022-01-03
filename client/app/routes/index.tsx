import { useEffect, useCallback, useMemo } from 'react'
import { useLoaderData, json, useTransition, useFetcher } from 'remix'
import type { LoaderFunction } from 'remix'
import PullToRefresh from 'react-simple-pull-to-refresh'

import styles from '../snow/snow.css'
import SnowSummary from '../snow/SnowSummary'
import { getSummary } from '../snow/store'
import { headers, cacheControl, defaultCacheTime, defaultSwrTime } from '../util/loader'
// import { useRefresh } from '~/util/useRefresh'
import { AppContext } from '~/types/context'
import { onVisibilityChange } from '~/util/onVisibilityChange'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export async function loader({ context }: { context: AppContext }) {
  const summary = await getSummary(context)
  return json(summary, {
    // headers: cacheControl({ maxAge: defaultCacheTime, swr: defaultSwrTime }),
  })
}

export default function Index() {
  const initialData = useLoaderData()
  const fetcher = useFetcher()
  const data = useMemo(() => fetcher?.data || initialData, [fetcher.data])

  const refresh = useCallback(async () => {
    fetcher.submit({})
  }, [fetcher.submit])

  const transition = useTransition()
  const isLoading = transition.state === 'loading' || fetcher.state === 'submitting'

  useEffect(() => {
    onVisibilityChange(refresh)
  }, [])

  return (
    <PullToRefresh onRefresh={refresh} isPullable={!isLoading} className="pulldown">
      <div>
        {/* <button onClick={refresh}>refresh debug</button> */}
        <SnowSummary summary={data} isLoading={isLoading} />
      </div>
    </PullToRefresh>
  )
}
