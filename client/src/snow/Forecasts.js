import React from 'react'

export default function Forecasts({ forecasts }) {
  if (!forecasts) {
    return (
      <ul className="forecasts">
        <span>Error retrieving forecasts</span>
      </ul>
    )
  }
  return (
    <ul className="forecasts">
      {forecasts.map(f => (
        <Forecast key={f.name} forecast={f} />
      ))}
    </ul>
  )
}

function Forecast({ forecast }) {
  return (
    <li>
      <div className="forecast-summary">
        <span className="forecast-name">{forecast.name}</span>
        <span className={`forecast-temp ${forecast.isDaytime ? 'day' : ''}`}>
          {forecast.temperature}
          {forecast.temperatureUnit}
        </span>
        <span className="forecast-wind">{forecast.windSpeed}</span>
        <img
          className="forecast-icon"
          src={forecast.icon}
          alt={forecast.shortForecast}
        />
      </div>
      <span className="forecast-detail">{forecast.detailedForecast}</span>
    </li>
  )
}

// {
//   "name": "Today",
//   "startTime": "2019-12-24T17:00:00Z",
//   "isDaytime": true,
//   "temperature": 24,
//   "temperatureUnit": "F",
//   "temperatureTrend": "falling",
//   "windSpeed": "5 mph",
//   "icon": "https://api.weather.gov/icons/land/day/bkn/snow,40?size=medium",
//   "shortForecast": "Partly Sunny then Chance Light Snow",
//   "detailedForecast": "A chance of snow after 4pm. Partly sunny. High near 24, with temperatures falling to around 21 in the afternoon. West wind around 5 mph. Chance of precipitation is 40%. New snow accumulation of less than one inch possible."
// }
