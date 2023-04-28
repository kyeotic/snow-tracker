import { useState, useMemo } from 'react'

import { Link, PageSpinner } from '../components/index.ts'
import config from '../constants.ts'
import Snowfalls from './Snowfall.tsx'
import Condition from './Condition.tsx'
import Lifts from './Lifts.tsx'
import Forecasts from './Forecasts.tsx'
import { formatDateFull } from '../util/dates.ts'

export default function SnowSummary({ summary }: any) {
  let [selected, setSelected] = useState<keyof typeof config>('meadows')
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
