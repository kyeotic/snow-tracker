import React, { useState, useEffect } from 'react'
import { getDietLogs } from './store'
import { PageSpinner } from '../components/index.js'
import RedBox from 'redbox-react'

import DietChart from './DietChart'

export default function DietPage() {
  const [logs, setLogs] = useState(null)
  const [query] = useState('onload')

  useEffect(() => {
    getDietLogs()
      .then(setLogs)
      .catch(setLogs)
  }, [query])

  if (!logs) return <PageSpinner />
  if (logs && logs.message) return <RedBox error={logs} />
  return <DietChart logs={logs} />
}
