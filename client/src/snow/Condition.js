import React from 'react'

export default function Condition({ condition, temperature, iconClass }) {
  return (
    <div className="conditions">
      <h2>Conditions</h2>
      <span className="condition-temp tight">{temperature}</span>
      <small className="condition-status tight">{condition}</small>
      <i title={condition} className={iconClass} />
    </div>
  )
}
