'use strict'

const cheerio = require('cheerio')
const { wrapper } = require('lambda-logger-node')

const _logger = Symbol('_logger')
const _dom = Symbol('_dom')

class SkiBowlParser {
  constructor({ html, logger }) {
    this[_logger] = wrapper(logger)
    this[_dom] = cheerio.load(html)
  }

  getLiftStatuses() {
    let rows = this[_dom]('#onpageLiftStatus tbody:first-of-type')
      .find('tr')
      .get()
      .map(liftStatusRow(this[_dom]))
      .filter(r => r.name.toLowerCase().includes('chair'))
      .map(r => ({ ...r, name: r.name.replace(/\s?Chair/i, '') }))
    this[_logger].debug('lift statuses', rows)
    return rows
  }

  getSnowfall() {
    let conditions = this[_dom]('.currentConditions tbody:first-of-type')
    let baseDepth = conditions
      .find('td.label')
      .filter((i, panel) => {
        let p = this[_dom](panel)
        return p.html().includes('Snow Depth')
      })
      .first()
      .siblings()
      .text()
    // Base Deptyh is a range, just get the low end
    baseDepth = parseFloat(
      baseDepth.substring(0, baseDepth.indexOf('"')).trim()
    )

    let newSnow = conditions
      .find('td.label')
      .filter((i, panel) => {
        // console.log('panel', Object.keys(panel))
        let p = this[_dom](panel)
        return p.html().includes('New Snow')
      })
      .parent()
      .get()
      .map(el => {
        let row = this[_dom](el)
        let since = row
          .find('td')
          .first()
          .text()
          .trim()
        since = since.match(/\d{2}/)[0]
        return {
          since: `Last ${since} hrs`,
          depth: parseFloat(
            row
              .find('td')
              .last()
              .text()
              .trim()
              .replace('"', '')
          )
        }
      })
    // this[_logger].debug('conditions', levels)
    // { depth, since }
    if (Number.isNaN(baseDepth)) baseDepth = 0
    return [
      ...newSnow,
      {
        since: 'Base Depth',
        depth: baseDepth
      }
    ]
  }

  getLastUpdatedTime() {
    let date = this[_dom]('.currentConditions tbody:first-of-type')
      .find('td.label')
      .filter((i, panel) => {
        let p = this[_dom](panel)
        return p.html().includes('Last Updated')
      })
      .siblings()
    // console.log('date', date.text())
    return date.text() || 'Unavailable'
  }
}

module.exports = {
  SkiBowlParser
}

function liftStatusRow($) {
  return row => {
    let r = $(row).find('td')
    // console.log(r.html())
    let hours = r
      .eq(1)
      .text()
      .trim()
    return {
      name: r
        .eq(0)
        .text()
        .replace(':', '')
        .trim(),
      hours,
      status: hours.toLowerCase().includes('m-') ? 'Open' : 'Closed'
    }
  }
}
