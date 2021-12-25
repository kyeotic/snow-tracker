import { useEffect } from 'react'
import { useLoaderData, json, useTransition } from 'remix'
import type { LoaderFunction } from 'remix'
import Pully from '@nattlivet/react-pully'

import styles from '../snow/snow.css'
import SnowSummary from '../snow/SnowSummary'
import { getSummary } from '../snow/store'
import { headers, cacheControl, defaultCacheTime, defaultSwrTime } from '../util/loader'
import { useRefresh } from '~/util/useRefresh'
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
  const data = useLoaderData()
  const refresh = useRefresh()
  const transition = useTransition()
  const isLoading = transition.state === 'loading'
  useEffect(() => {
    onVisibilityChange(refresh)
  }, [])
  return (
    <Pully onRefresh={refresh} disabled={isLoading} className="pulldown">
      <div>
        {/* <button onClick={refresh}>refresh3</button> */}
        <SnowSummary summary={data} isLoading={isLoading} />
      </div>
    </Pully>
  )
}
