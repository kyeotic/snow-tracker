import React, { useState } from 'react'

import { Link, PageSpinner } from '../components/index.js'
import config from '../config.js'
import Snowfalls from './Snowfall.js'
import Condition from './Condition'
import Lifts from './Lifts.js'
import Forecasts from './Forecasts.js'

export default function SnowSummary({ summary, isLoading }) {
  let [selected, setSelected] = useState('timberline')
  return (
    <div className="snow-summary-container">
      <section className="snow-summary-conditions">
        {isLoading ? (
          <PageSpinner />
        ) : (
          <>
            <div className="conditions-headers">
              <h1
                onClick={() => setSelected('timberline')}
                className={`${selected === 'timberline' ? 'active' : ''}`}
              >
                Timberline{' '}
                <small>
                  (
                  <Link href={config.timberline.conditionsUrl}>
                    {summary.timberline.lastUpdated}
                  </Link>
                  )
                </small>
              </h1>
              <h1
                onClick={() => setSelected('skiBowl')}
                className={`${selected === 'skiBowl' ? 'active' : ''}`}
              >
                Ski Bowl{' '}
                <small>
                  (
                  <Link href={config.skiBowl.conditionsUrl}>
                    {summary.skiBowl.lastUpdated}
                  </Link>
                  )
                </small>
              </h1>
            </div>
            <div className="conditions-container">
              <Condition {...summary[selected].condition} />
              <Snowfalls snowfalls={summary[selected].snowfalls} />
              <Lifts lifts={summary[selected].liftStatuses} />
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
              NOAA
              <small>
                (<Link href={config[selected].noaaUrl}>go to site</Link>)
              </small>
            </h1>
            <Forecasts forecasts={summary[selected].forecast} />
          </>
        )}
      </section>
    </div>
  )
}
