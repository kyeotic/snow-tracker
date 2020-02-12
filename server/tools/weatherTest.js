/* eslint-disable no-console */
'use strict'

process.env.TEST = true
require('dotenv').config()
const { wrapContext } = require('../src/context')
const context = wrapContext()

async function main() {
  let { weather } = context
  let base = await weather.getForecast(context.config.timberline.weather.point)
  console.log(base)
}

main().catch(e => console.error(e))
