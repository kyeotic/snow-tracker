import React from 'react'
import Spinner from 'react-md-spinner'

import './pageSpinner.css'

export default function PageSpinner() {
  return (
    <div className="page-spinner-container">
      <Spinner size={256} />
    </div>
  )
}
