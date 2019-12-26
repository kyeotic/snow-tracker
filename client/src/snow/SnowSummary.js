import React from 'react'
import { PageSpinner } from '../components/index.js'

import { Link } from '../components/index.js'
import config from '../config.js'
import Snowfalls from './Snowfall.js'
import Lifts from './Lifts.js'
import Forecasts from './Forecasts.js'

export default function SnowSummary({ summary, isLoading }) {
  return (
    <div className="snow-summary-container">
      <section className="snow-summary-timberline">
        {isLoading ? (
          <PageSpinner />
        ) : (
          <>
            <h1>
              <Link href={config.timberlineConditionsUrl}>Timberline</Link>{' '}
              <small>({summary.timberline.lastUpdated})</small>
            </h1>
            <div className="timberline-container">
              <Snowfalls snowfalls={summary.timberline.snowfalls} />
              <Lifts lifts={summary.timberline.liftStatuses} />
            </div>
          </>
        )}
      </section>
      <section className="snow-summary-noaa">
        {isLoading ? (
          <PageSpinner />
        ) : (
          <>
            <h1>
              <Link href={config.noaaUrl}>NOAA</Link>
            </h1>
            <Forecasts forecasts={summary.forecast} />
          </>
        )}
      </section>
    </div>
  )
}
