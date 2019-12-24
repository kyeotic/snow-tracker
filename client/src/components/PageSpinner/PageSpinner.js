import React from 'react'
import { DualRing } from 'react-loading-io'

import './pageSpinner.css'

export default function PageSpinner() {
  return (
    <div className="page-spinner-container">
      <DualRing size={256} />
    </div>
  )
}
