import { Logger } from '../util/logger'

export interface ParserFactory {
  ({ html, logger }: { html: string; logger: Logger }): Parser
}

export interface Parser {
  getLiftStatuses: LiftStatus[]
  getLiftUpdatedTime: string
  getLastUpdatedTime: string
  getSnowfall: SnowFall[]
  getCondition: Condition
}

export interface LiftStatus {
  name: string
  status: string
  hours: string
}

export interface Condition {
  updatedOn: string
  temperature: number
  condition: string
  iconClass: string
}

export interface SnowFall {
  since: string
  depth: number
}
