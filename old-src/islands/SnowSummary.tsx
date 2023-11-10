import { useMemo, useState } from 'preact/hooks'

import type Config from '../config.ts'
import Link from '../components/Link.tsx'
import Snowfalls from '../components/Snowfall.tsx'
import Condition from '../components/Condition.tsx'
import Lifts from '../components/Lifts.tsx'
import Forecasts from '../components/Forecasts.tsx'
import { formatDateFull } from '../utils/dates.ts'
import { SnowReport } from '../worker/api.ts'

export default function SnowSummary(
  { summary, config }: { summary: SnowReport; config: typeof Config },
) {
  const [selected, setSelected] = useState<keyof Omit<typeof Config, 'timeZone' | 'weather'>>(
    'meadows',
  )
  const selectedSummary = summary?.[selected]!!
  const headerProps = useMemo(
    () => ({
      setSelected,
      summary,
      selection: selected,
    }),
    [setSelected, summary, selected],
  )
  return (
    <div className='snow-summary-container'>
      <section className='snow-summary-conditions'>
        <div className='conditions-headers'>
          <SnowHeader
            {...headerProps}
            title='Meadows'
            group='meadows'
            conditionsUrl={config['meadows'].conditionsUrl}
          />
          <SnowHeader
            {...headerProps}
            title='Timberline'
            group='timberline'
            conditionsUrl={config['timberline'].conditionsUrl}
          />
          <SnowHeader
            {...headerProps}
            title='Ski Bowl'
            group='skiBowl'
            conditionsUrl={config['skiBowl'].conditionsUrl}
          />
        </div>
        <div className='conditions-container'>
          {selectedSummary.status && (
            <>
              <Condition {...selectedSummary.status.condition} />
              <Snowfalls snowfalls={selectedSummary.status.snowfalls} />
              <Lifts lifts={selectedSummary.status.lifts} />
            </>
          )}
        </div>
      </section>
      <section className='snow-summary-noaa'>
        <h1>
          NOAA
          <small>
            (<Link href={config[selected].noaaUrl}>go to site</Link>)
          </small>
        </h1>
        {selectedSummary.status && <Forecasts forecasts={selectedSummary.status.forecast} />}
      </section>
    </div>
  )
}

function SnowHeader({ title, group, selection, setSelected, summary, conditionsUrl }) {
  return (
    <h1 onClick={() => setSelected(group)} className={`${selection === group ? 'active' : ''}`}>
      {title}
      <small className='subtitle'>
        (<Link href={conditionsUrl}>{formatDateFull(summary[group]?.updatedOn)}</Link>
        )
      </small>
    </h1>
  )
}
