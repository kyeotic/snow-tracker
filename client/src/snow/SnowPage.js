import React from 'react'
import { useSummary } from './store'
import RedBox from 'redbox-react'

import './snow.css'
import SnowSummary from './SnowSummary'

export default function SnowPage() {
  const [summary, isLoading, summaryError] = useSummary()
  if (summaryError) return <RedBox error={summaryError} />
  return <SnowSummary summary={summary} isLoading={isLoading} />
}
