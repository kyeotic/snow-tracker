import cheerio, { CheerioAPI } from 'cheerio'
import { DateTime } from 'luxon'
import { ConditionsStore, Parser, ParserProps } from './baseStore.ts'
import { Condition, LiftStatus, Snowfall } from '../weather/types.ts'
import { tryParseFloat } from '../util/parse.ts'
import { ILogger, wrapper } from '../util/logger.ts'

const dateFormat = "MMMM d',' yyyy h':'mma"

export class SkiBowlStore extends ConditionsStore {
  constructor(props: Omit<ConstructorParameters<typeof ConditionsStore>[0], 'parserFactory'>) {
    super({
      ...props,
      headers: {
        'User-Agent': 'PostmanRuntime/7.21.0',
        Host: 'skibowl.com',
      },
      parserFactory: (...props) => new SkiBowlParser(...props),
    })
  }

  async getCondition(): Promise<Condition | null> {
    return super.getCurrentConditions()
  }
}

export class SkiBowlParser implements Parser {
  private timeZone: string
  private logger: ILogger
  private dom: CheerioAPI

  constructor({ html, logger, timeZone }: ParserProps) {
    this.logger = wrapper(logger)
    this.dom = cheerio.load(html)
    this.timeZone = timeZone
  }

  async getLiftStatuses(): Promise<LiftStatus[]> {
    let rows = this.dom('#intro #liststatuses')
      .find('tr')
      .get()
      .map(liftStatusRow(this.dom))
      .filter((r: any) => r.name.toLowerCase().includes('chair'))
      .map((r: any) => ({ ...r, name: r.name.replace(/\s?Chair/i, '') }))
    this.logger.debug('lift statuses', rows)
    return rows
  }

  async getLiftUpdatedTime(): Promise<string | null> {
    return this.getLastUpdatedTime()
  }

  async getSnowfall(): Promise<Snowfall[]> {
    let conditions = this.dom('#liststatuses')
    let baseDepthStr = conditions
      .find('td')
      .filter((i: any, panel: any) => {
        let p = this.dom(panel)
        return p.html()!!.includes('Snow Depth')
      })
      .first()
      .siblings()
      .text()
    // Base Deptyh is a range, just get the low end
    let baseDepth = tryParseFloat(baseDepthStr.substring(0, baseDepthStr.indexOf('"')).trim())

    let newSnow = conditions
      .find('td')
      .filter((i: any, panel: any) => {
        // console.log('panel', Object.keys(panel))
        let p = this.dom(panel)
        return p.html()!!.includes('New Snow')
      })
      .parent()
      .get()
      .map((el: any) => {
        let row = this.dom(el)
        let since = row.find('td').first().text().trim()
        since = since.match(/\d{2}/)!![0]
        const depth = tryParseFloat(row.find('td').last().text().trim().replace('"', ''))
        return {
          since: `Last ${since} hrs`,
          depth,
        }
      })
    return [
      ...newSnow,
      {
        since: 'Base Depth',
        depth: baseDepth,
      },
    ]
  }

  async getLastUpdatedTime(): Promise<string | null> {
    const updates = this.dom('#liststatuses').find('tr')

    let date = updates
      .filter((i: any, panel: any) => {
        let p = this.dom(panel)
        return p.html()!!.includes('Date:')
      })
      .find('td')
      .eq(1)
    let time = updates
      .filter((i: any, panel: any) => {
        let p = this.dom(panel)
        return p.html()!!.includes('Time:')
      })
      .find('td')
      .eq(1)

    if (!date || !time) return null

    // this.logger.info(
    //   'date',
    //   date.text(),
    //   time.text().toUpperCase(),
    //   DateTime.fromFormat(`${date.text()} ${time.text().toUpperCase()}`, dateFormat, {
    //     zone: config.timeZone,
    //   }).toJSDate()
    // )
    // return null
    // return date.text() || null

    return DateTime.fromFormat(`${date.text()} ${time.text().toUpperCase()}`, dateFormat, {
      zone: this.timeZone,
    }).toISO()
  }

  async getCondition(): Promise<Condition | null> {
    // implemented in store
    return null
  }
}

function liftStatusRow($: CheerioAPI) {
  return (row: any) => {
    row = $(row)
    let r = $(row).find('td')
    // console.log('row', .html())
    let hours = r.eq(2).text().trim()
    let status = r.eq(1).text().trim()
    return {
      name: r.eq(0).text().replace(':', '').trim(),
      hours,
      status, //: hours.toLowerCase().includes('m-') ? 'Open' : 'Closed'
    }
  }
}
