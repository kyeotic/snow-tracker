import { useEffect, useCallback, useMemo } from 'react'
import { json } from '@remix-run/node'
import { useLoaderData, useNavigation, useFetcher } from '@remix-run/react'
import PullToRefresh from 'react-simple-pull-to-refresh'

import styles from '../snow/snow.css'
import SnowSummary from '../snow/SnowSummary'
import { getSummary } from '../snow/store'
import { onVisibilityChange } from '~/util/onVisibilityChange'

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
  const initialData = useLoaderData()
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
      {/* <button onClick={refresh}>refresh debug</button> */}
      {/* <span>test</span> */}
      <SnowSummary summary={data} />
    </div>
    // <PullToRefresh onRefresh={refresh} isPullable={!isLoading} className="pulldown">
    // </PullToRefresh>
  )
}
