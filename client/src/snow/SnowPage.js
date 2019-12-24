import React, { useState, useEffect } from 'react'
import { getSummary } from './store'
import { PageSpinner } from '../components/index.js'
import RedBox from 'redbox-react'

import './snow.css'
import SnowSummary from './SnowSummary'

export default function SnowPage() {
  const [summary, setSummary] = useState(null)
  const [query] = useState('onload')

  useEffect(() => {
    getSummary()
      .then(setSummary)
      .catch(setSummary)
  }, [query])

  if (!summary) return <PageSpinner />
  if (summary && summary.message) return <RedBox error={summary} />
  return <SnowSummary summary={summary} />
}
