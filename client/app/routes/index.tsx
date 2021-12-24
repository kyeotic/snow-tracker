import { useEffect } from 'react'
import { useLoaderData, json, useTransition } from 'remix'
import type { LoaderFunction } from 'remix'
import Pully from '@nattlivet/react-pully'

import styles from '../snow/snow.css'
import SnowSummary from '../snow/SnowSummary'
import { getSummary } from '../snow/store'
import { headers, cacheControl, fiveMinutes, oneHour } from '../util/loader'
import { useRefresh } from '../util/useRefresh'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export async function loader({ context }) {
  console.log('context', context)
  const summary = await getSummary()
  return json(summary, {
    headers: cacheControl({ maxAge: fiveMinutes, swr: oneHour }),
  })
}

export default function Index() {
  const data = useLoaderData()
  const refresh = useRefresh()
  const transition = useTransition()
  const isLoading = transition.state === 'loading'
  useEffect(() => {
    console.log('load')
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
