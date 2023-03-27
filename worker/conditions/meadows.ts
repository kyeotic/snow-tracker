import { ConditionsStore, Parser, ParserProps } from './baseStore'
import { Condition, LiftStatus, Snowfall } from '../weather/types'
import cheerio, { CheerioAPI } from 'cheerio'
import { tryParseFloat } from '../util/parse'
import { DateTime } from 'luxon'
import config from '../config'
import { ILogger, wrapper } from '../util/logger'

export class MeadowsStore extends ConditionsStore {
  constructor(props: Omit<ConstructorParameters<typeof ConditionsStore>[0], 'parserFactory'>) {
    super({
      ...props,
      parserFactory: (...props) => new MeadowsParser(...props),
    })
  }
}

const dateFormat = "EEEE MMMM d 'at' h':'mm a"

export class MeadowsParser implements Parser {
  private logger: ILogger
  private dom: CheerioAPI

  constructor({ html, logger }: ParserProps) {
    this.logger = wrapper(logger)
    this.dom = cheerio.load(html)
  }

  async getLiftStatuses(): Promise<LiftStatus[]> {
    let rows = this.dom('#liftGrid tbody').find('tr').get().map(liftStatusRow(this.dom))
    this.logger.debug('lift statuses', rows)
    return rows
  }

  async getLiftUpdatedTime(): Promise<string | null> {
    let date = this.dom('.conditions-info.lift-operations')
      .find('p')
      .first()
      .text()
      .replace(/^for /, '')

    if (!date) return null

    return DateTime.fromFormat(date, dateFormat, {
      zone: config.timeZone,
    }).toISO()
  }

  async getSnowfall(): Promise<Snowfall[]> {
    const baseDepth = tryParseFloat(
      this.dom('.snowdepth-base').find('.reading.depth').first().attr('data-depth')
    )
    const midDepth = tryParseFloat(
      this.dom('.snowdepth-mid').find('.reading.depth').first().attr('data-depth')
    )
    const yttDepth = tryParseFloat(
      this.dom('.snowdepth-ytd').find('.reading.depth').first().attr('data-depth')
    )

    let levels = this.dom('.conditions-snowfall')
      .find('dl')
      .map((i, el) => {
        return {
          since: this.dom(el).find('.metric').text().trim(),
          depth: tryParseFloat(this.dom(el).find('.reading.depth').first().attr('data-depth')),
        }
      })
      .get()
    this.logger.debug('conditions', levels)
    return [
      { since: 'Base Depth', depth: baseDepth },
      { since: 'Mid Depth', depth: midDepth },
      { since: 'Snow YTD', depth: yttDepth },
      ...levels,
    ]
  }

  async getLastUpdatedTime(): Promise<string | null> {
    let date = this.dom('.conditions-current .metric').find('time').first().text()

    if (!date) return null

    return DateTime.fromFormat(date, dateFormat, {
      zone: config.timeZone,
    }).toISO()
  }

  async getCondition(): Promise<Condition> {
    const conditions = this.dom('.conditions-glance-widget.conditions-current')
    const temperature = tryParseFloat(
      conditions.find('.reading.temperature').first().attr('data-temperature')
    )
    const condition = conditions.find('.reading.conditions').first().text().trim()
    const conditionIcon = conditions.find('.reading.conditions').first().attr('data-conditions')
    const updatedOn = await this.getLastUpdatedTime()
    return {
      updatedOn,
      temperature,
      condition,
      iconClass: `weather-icon wi wi-day-${conditionIcon}`,
    }
  }
}

function liftStatusRow($: CheerioAPI) {
  return (row: any) => {
    let r = $(row).find('td')
    // console.log(r.html())
    return {
      name: r.eq(1).text().trim(),
      status: r.eq(0).text().trim(),
      hours: r.eq(2).text().trim(),
    }
  }
}
