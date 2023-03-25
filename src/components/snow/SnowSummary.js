import { useState, useMemo } from 'react'

import { Link, PageSpinner } from '../components/index.js'
import config from '../config.js'
import Snowfalls from './Snowfall.js'
import Condition from './Condition.js'
import Lifts from './Lifts.js'
import Forecasts from './Forecasts.js'
import { formatDateFull } from '../util/format.js'

export default function SnowSummary({ summary }) {
  let [selected, setSelected] = useState('meadows')
  const selectedSummary = summary?.[selected] || {}
  const headerProps = useMemo(
    () => ({
      setSelected,
      summary,
      selection: selected,
    }),
    [setSelected, summary, selected]
  )
  return (
    <div className="snow-summary-container">
      <section className="snow-summary-conditions">
        <div className="conditions-headers">
          <SnowHeader {...headerProps} title="Meadows" group="meadows" />
          <SnowHeader {...headerProps} title="Timberline" group="timberline" />
          <SnowHeader {...headerProps} title="Ski Bowl" group="skiBowl" />
        </div>
        <div className="conditions-container">
          <Condition {...selectedSummary.condition} />
          <Snowfalls snowfalls={selectedSummary.snowfalls} />
          <Lifts lifts={selectedSummary.lifts} />
        </div>
      </section>
      <section className="snow-summary-noaa">
        <h1>
          NOAA
          <small>
            (<Link href={config[selected].noaaUrl}>go to site</Link>)
          </small>
        </h1>
        <Forecasts forecasts={selectedSummary.forecast} />
      </section>
    </div>
  )
}

function SnowHeader({ title, group, selection, setSelected, summary }) {
  return (
    <h1 onClick={() => setSelected(group)} className={`${selection === group ? 'active' : ''}`}>
      {title}
      <small className="subtitle">
        (<Link href={config[group].conditionsUrl}>{formatDateFull(summary[group]?.updatedOn)}</Link>
        )
      </small>
    </h1>
  )
}
