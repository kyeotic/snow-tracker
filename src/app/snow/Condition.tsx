import { formatDateFull } from '../util/format.ts'
import { type Condition as SnowCondition } from '../../worker/weather/types.ts'

export default function Condition({
  condition,
  temperature,
  iconClass,
  updatedOn = 'Unavailable',
}: SnowCondition) {
  if (!temperature && !condition) {
    return <span className="conditions">Error getting conditions</span>
  }
  return (
    <div className="conditions">
      <h2>
        Conditions <span className="updated">{formatDateFull(updatedOn)}</span>
      </h2>
      <span className="condition-temp">{temperature}</span>
      <span className="condition-status">{condition}</span>
      <i title={condition} className={iconClass} />
    </div>
  )
}
