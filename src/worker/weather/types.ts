export interface LiftStatus {
  name: string
  status: string
  hours: string
}

export interface Condition {
  updatedOn: string | null
  temperature: number
  condition: string
  iconClass: string
}

export interface Snowfall {
  since: string
  depth: number
}

export interface Lifts {
  updatedOn: string | null
  liftStatuses: LiftStatus[]
}

export interface SnowStatus {
  /** The last time the source was checked for an updated */
  checkedOn: string | null
  /** The current status. Will be null if status could not be retrieved */
  status: {
    /** Time that the source reports as last updated */
    updatedOn: string | null
    snowfalls: Snowfall[]
    lifts: Lifts
    condition: Condition | null
    forecast: ForecastPeriod[]
  } | null
}

export interface ForecastPeriod {
  number: number
  name: string
  startTime: string
  endTime: string
  isDaytime: boolean
  temperature: number
  temperatureUnit: string
  temperatureTrend: string
  windSpeed: string
  windDirection: string
  icon: string
  shortForecast: string
  detailedForecast: string
}

export interface ConditionConfig {
  timeZone: string
  conditionsUrl: string
  noaaUrl: string
  weather: {
    station: string
    point: string
    office: string
    grid: {
      id: string
      x: number
      y: number
    }
  }
}

export interface GridPoint {
  id: string
  x: number
  y: number
}
