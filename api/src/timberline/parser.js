import cheerio from 'cheerio'
import { wrapper } from 'lambda-logger-node'
import { DateTime } from 'luxon'
import config from '../config.js'

const _logger = Symbol('_logger')
const _dom = Symbol('_dom')

const dateFormat = "MMMM d '- Updated at' h':'mm a"

export class TimberlineParser {
  constructor({ html, logger }) {
    this[_logger] = wrapper(logger)
    this[_dom] = cheerio.load(html)
  }

  getLiftStatuses() {
    let rows = this[_dom]('#lift_status table:first-of-type tbody')
      .find('tr')
      .get()
      .map(liftStatusRow(this[_dom]))
    this[_logger].debug('lift statuses', rows)
    return rows
  }

  getLiftUpdatedTime() {
    return this.getLastUpdatedTime()
  }

  getSnowfall() {
    let levels = this[_dom]('.conditions-panel')
      .filter(depthFilter(this[_dom]))
      .find('dl dt')
      .map((i, el) => {
        return {
          since: this[_dom](el).next().text().trim(),
          depth: parseFloat(this[_dom](el).text().trim().replace('"', '')),
        }
      })
      .get()
    this[_logger].debug('conditions', levels)
    return levels
  }

  getLastUpdatedTime() {
    let date = this[_dom]('.conditions-panel').find('p').first().text().trim()
    // return date
    return DateTime.fromFormat(date, dateFormat, {
      zone: config.timeZone,
    }).toISO()
  }

  getCondition() {
    let tempNode = this[_dom]('.temp')
    let [temperature, condition] = tempNode
      .text()
      .trim()
      .split('\n')
      .map((s) => s.trim())
    temperature = parseFloat(temperature)
    this[_logger].info('temp', temperature, condition)
    let iconNode = tempNode.siblings('i')
    let icons = iconNode
      .attr('class')
      .split(/\s/)
      .filter((s) => !!s)
      .map((s) => s.trim())
    this[_logger].info('icons', icons)

    const updatedOn = this.getLastUpdatedTime()
    return {
      updatedOn,
      temperature,
      condition,
      iconClass: icons.join(' '),
    }
  }
}

function liftStatusRow($) {
  return (row) => {
    let r = $(row).find('td')
    // console.log(r.html())
    return {
      name: r.eq(0).text().trim(),
      status: r.eq(1).find('span').eq(0).text().trim(),
      hours: r.eq(2).text().trim(),
    }
  }
}

function depthFilter($) {
  return (i, panel) => {
    let p = $(panel)
    return p.html().includes('Base depth')
  }
}
