import cheerio, { CheerioAPI } from 'cheerio'
import { DateTime } from 'luxon'
import { ConditionsStore, Parser, ParserProps } from './baseStore.ts'
import { Condition, LiftStatus, Snowfall } from '../weather/types.ts'
import { ILogger, wrapper } from '../util/logger.ts'

export class TimberlineStore extends ConditionsStore {
  constructor(props: Omit<ConstructorParameters<typeof ConditionsStore>[0], 'parserFactory'>) {
    super({
      ...props,
      headers: {
        'User-Agent': 'PostmanRuntime/7.21.0',
        Host: 'www.timberlinelodge.com',
      },
      parserFactory: (...props) => new TimberlineParser(...props),
    })
  }
}

const dateFormat = "MMMM d '- Updated at' h':'mm a"

export class TimberlineParser implements Parser {
  private timeZone: string
  private logger: ILogger
  private dom: CheerioAPI

  constructor({ html, logger, timeZone }: ParserProps) {
    this.logger = wrapper(logger)
    this.dom = cheerio.load(html)
    this.timeZone = timeZone
  }

  async getLiftStatuses(): Promise<LiftStatus[]> {
    let rows = this.dom('#lift_status table:first-of-type tbody')
      .find('tr')
      .get()
      .map(liftStatusRow(this.dom))
    this.logger.debug('lift statuses', rows)
    return rows
  }

  async getLiftUpdatedTime(): Promise<string | null> {
    return this.getLastUpdatedTime()
  }

  async getSnowfall(): Promise<Snowfall[]> {
    let levels = this.dom('.conditions-panel')
      .filter(depthFilter(this.dom))
      .find('dl dt')
      .map((i: any, el: any) => {
        return {
          since: this.dom(el).next().text().trim(),
          depth: parseFloat(this.dom(el).text().trim().replace('"', '')),
        }
      })
      .get()
    this.logger.debug('conditions', levels)
    return levels
  }

  async getLastUpdatedTime(): Promise<string | null> {
    let date = this.dom('.conditions-panel').find('p').first().text().trim()
    // return date
    return DateTime.fromFormat(date, dateFormat, {
      zone: this.timeZone,
    }).toISO()
  }

  async getCondition(): Promise<Condition> {
    let tempNode = this.dom('.temp')
    let [temperatureStr, condition] = tempNode
      .text()
      .trim()
      .split('\n')
      .map((s: any) => s.trim())
    let temperature = parseFloat(temperatureStr)
    // this.logger.info('temp', temperature, condition)
    let iconNode = tempNode.siblings('i')
    let icons = iconNode
      .attr('class')!!
      .split(/\s/)
      .filter((s: any) => !!s)
      .map((s: any) => s.trim())
    this.logger.debug('icons', icons)

    const updatedOn = await this.getLastUpdatedTime()
    return {
      updatedOn,
      temperature,
      condition,
      iconClass: icons.join(' '),
    }
  }
}

function liftStatusRow($: CheerioAPI) {
  return (row: any) => {
    let r = $(row).find('td')
    // console.log(r.html())
    return {
      name: r.eq(0).text().trim(),
      status: r.eq(1).find('span').eq(0).text().trim(),
      hours: r.eq(2).text().trim(),
    }
  }
}

function depthFilter($: CheerioAPI) {
  return (_: any, panel: any) => {
    let p = $(panel)
    return p.html()!!.includes('Base depth')
  }
}
