import { useCallback } from 'react'
import PullToRefresh from 'react-simple-pull-to-refresh'

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
  const handleRefresh = useCallback(() => refresh(), [refresh])
  if (summaryError) return <RedBox error={summaryError} />
  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <SnowSummary summary={summary} isLoading={isLoading} />
    </PullToRefresh>
  )
}
