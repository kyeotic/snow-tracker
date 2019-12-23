import React from 'react'
import { map, evolve, sortBy, prop, pipe } from 'ramda'
import dateformat from 'dateformat'
import {
  AreaChart,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './dietChart.css'

const chartTransform = pipe(
  sortBy(prop('date')),
  map(evolve({ date: d => dateformat(d, 'mm/dd') }))
)

const chartMargin = { top: 5, right: 0, bottom: 5, left: 0 }
const xTickMargin = 10

export default function DietChart({ logs }) {
  if (!logs) return null
  logs = chartTransform(logs)
  return (
    <div className="diet-wrapper">
      <div className="chart">
        <ResponsiveContainer>
          <AreaChart syncId="diet" data={logs} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickMargin={xTickMargin} />
            <Tooltip />
            <Legend />
            <YAxis domain={['dataMin - 5', 'dataMax + 7']} />
            <Area type="monotone" dataKey="weight" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* <div className="chart">
        <ResponsiveContainer>
          <LineChart syncId="diet" data={logs} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickMargin={xTickMargin} />
            <Tooltip />
            <Legend />
            <YAxis
              dataKey="fat"
              stroke="#ffc658"
              domain={[0, 'dataMax + 20']}
            />
            <Line type="monotone" dataKey="fat" stroke="#ffc658" />
            <Line type="monotone" dataKey="carbs" stroke="#82ca9d" />
            <Line type="monotone" dataKey="protien" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart">
        <ResponsiveContainer>
          <LineChart syncId="diet" data={logs} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickMargin={xTickMargin} />
            <Tooltip />
            <Legend />
            <YAxis
              dataKey="calories"
              stroke="#8884d8"
              domain={['dataMin - 500', 'dataMax + 200']}
            />
            <Line type="monotone" dataKey="calories" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div> */}
    </div>
  )
}
