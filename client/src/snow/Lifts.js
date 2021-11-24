import React from 'react'

import { formatDateFull } from '../util/format.js'

export default function Lifts({
  lifts: { updatedOn, liftStatuses = [] } = {},
}) {
  return (
    <div className="lifts">
      <h2>
        Lifts <span className="updated">{formatDateFull(updatedOn)}</span>
      </h2>
      <ul className="lift-statuses">
        {liftStatuses.map((lift) => (
          <Lift lift={lift} key={lift.name} />
        ))}
      </ul>
    </div>
  )
}

function Lift({ lift: { name, status, hours } = {} }) {
  const hasSubstatus = name.includes('(')
  const isOpen = status && status.toLowerCase().includes('open')
  let subStatus
  if (hasSubstatus) {
    subStatus = name.substring(name.indexOf('('))
    name = name.substring(0, name.indexOf('(') - 1)
  }
  return (
    <li>
      <span className={`lift-name${isOpen ? ' open' : ''}`}>{name}</span>
      {subStatus && isOpen && (
        <span className="lift-substatus">{subStatus}</span>
      )}
      <span className="lift-status">{status}</span>
      {isOpen && <span className="lift-hours">{hours}</span>}
    </li>
  )
}

// {
//   "name": "BRUNO’S",
//   "status": "open",
//   "hours": "9:00am - 4:00pm"
// }
