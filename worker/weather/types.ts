export interface LiftStatus {
  name: string
  status: string
  hours: string
}

export interface Condition {
  updatedOn: Date | null
  temperature: number
  condition: string
  iconClass: string
}

export interface Snowfall {
  since: string
  depth: number
}

export interface Lifts {
  updatedOn: Date | null
  liftStatuses: LiftStatus[]
}

export interface SnowStatus {
  updatedOn: Date | null
  snowfalls: Snowfall[]
  lifts: Lifts
  condition: Condition | null
  forecast: ForecastPeriod[]
}

export interface ForecastPeriod {
  number: number
  name: string
  startTime: Date
  endTime: Date
  isDaytime: Boolean
  temperature: number
  temperatureUnit: string
  temperatureTrend: String
  windSpeed: string
  windDirection: string
  icon: string
  shortForecast: string
  detailedForecast: string
}
