import cheerio from 'cheerio'
import { wrapper } from 'lambda-logger-node'
import { tryParseFloat } from '../util/parse.js'

const _logger = Symbol('_logger')
const _dom = Symbol('_dom')

export class MeadowsParser {
  constructor({ html, logger }) {
    this[_logger] = wrapper(logger)
    this[_dom] = cheerio.load(html)
  }

  getLiftStatuses() {
    let rows = this[_dom]('#liftGrid tbody')
      .find('tr')
      .get()
      .map(liftStatusRow(this[_dom]))
    this[_logger].debug('lift statuses', rows)
    return rows
  }

  getSnowfall() {
    const baseDepth = tryParseFloat(
      this[_dom]('.snowdepth-base')
        .find('.reading.depth')
        .first()
        .attr('data-depth')
    )
    const midDepth = tryParseFloat(
      this[_dom]('.snowdepth-mid')
        .find('.reading.depth')
        .first()
        .attr('data-depth')
    )

    let levels = this[_dom]('.conditions-snowfall')
      .find('dl')
      .map((i, el) => {
        return {
          since: this[_dom](el)
            .find('.metric')
            .text()
            .trim(),
          depth: tryParseFloat(
            this[_dom](el)
              .find('.reading.depth')
              .first()
              .attr('data-depth')
          )
        }
      })
      .get()
    this[_logger].debug('conditions', levels)
    return [
      { since: 'Base Depth', depth: baseDepth },
      { since: 'Mid Depth', depth: midDepth },
      ...levels
    ]
  }

  getLastUpdatedTime() {
    let date = this[_dom]('.conditions-info.lift-operations')
      .find('p')
      .first()
      .text()
      .replace(/^for /, '')
    // console.log('date', date.text())
    return date || 'Unavailable'
  }

  getCondition() {
    const conditions = this[_dom](
      '.conditions-glance-widget.conditions-current'
    )
    const temperature = parseFloat(
      conditions
        .find('.reading.temperature')
        .first()
        .attr('data-temperature')
    )
    const condition = conditions
      .find('.reading.conditions')
      .first()
      .text()
      .trim()
    const conditionIcon = conditions
      .find('.reading.conditions')
      .first()
      .attr('data-conditions')
    return {
      temperature,
      condition,
      iconClass: `weather-icon wi wi-day-${conditionIcon}`
    }
  }
}

function liftStatusRow($) {
  return row => {
    let r = $(row).find('td')
    // console.log(r.html())
    return {
      name: r
        .eq(1)
        .text()
        .trim(),
      status: r
        .eq(0)
        .text()
        .trim(),
      hours: r
        .eq(2)
        .text()
        .trim()
    }
  }
}
