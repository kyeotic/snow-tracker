import PullToRefresh from 'react-pullable'

import { useSummary } from './store.js'
import RedBox from 'redbox-react'

import './snow.css'
import SnowSummary from './SnowSummary.js'

export default function SnowPage() {
  const {
    data: summary,
    isLoading,
    error: summaryError,
    refresh,
  } = useSummary()
  if (summaryError) return <RedBox error={summaryError} />
  return (
    <PullToRefresh onRefresh={refresh}>
      <SnowSummary summary={summary} isLoading={isLoading} />
    </PullToRefresh>
  )
}
