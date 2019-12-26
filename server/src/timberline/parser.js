'use strict'

const cheerio = require('cheerio')
const { wrapper } = require('lambda-logger-node')

const _logger = Symbol('_logger')
const _dom = Symbol('_dom')

class TimberlineParser {
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

  getSnowfall() {
    let levels = this[_dom]('.conditions-panel')
      .filter(depthFilter(this[_dom]))
      .find('dl dt')
      .map((i, el) => {
        return {
          since: this[_dom](el)
            .next()
            .text()
            .trim(),
          depth: parseFloat(
            this[_dom](el)
              .text()
              .trim()
              .replace('"', '')
          )
        }
      })
      .get()
    this[_logger].debug('conditions', levels)
    return levels
  }

  getLastUpdatedTime() {
    let date = this[_dom]('.conditions-panel date')
    let time = date
      .siblings('small')
      .text()
      .trim()
    date = date.text().trim()
    return `${time} ${date}`
  }

  getCondition() {
    let tempNode = this[_dom]('.temp')
    let [temperature, condition] = tempNode
      .text()
      .trim()
      .split('\n')
      .map(s => s.trim())
    temperature = parseFloat(temperature)
    console.log('temp', temperature, condition)
    let iconNode = tempNode.siblings('i')
    let icons = iconNode
      .attr('class')
      .split(/\s/)
      .filter(s => !!s)
      .map(s => s.trim())
    console.log('icons', icons)
    return {
      temperature,
      condition,
      iconClass: icons.join(' ')
    }
  }
}

module.exports = {
  TimberlineParser
}

function liftStatusRow($) {
  return row => {
    let r = $(row).find('td')
    // console.log(r.html())
    return {
      name: r
        .eq(0)
        .text()
        .trim(),
      status: r
        .eq(1)
        .find('span')
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

function depthFilter($) {
  return (i, panel) => {
    let p = $(panel)
    return p.html().includes('Base depth')
  }
}
