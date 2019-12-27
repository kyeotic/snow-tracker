import React from 'react'

export default function Condition({ condition, temperature, iconClass }) {
  return (
    <div className="conditions">
      <h2>Conditions</h2>
      <span className="condition-temp">{temperature}</span>
      <span className="condition-status">{condition}</span>
      <i title={condition} className={iconClass} />
    </div>
  )
}
