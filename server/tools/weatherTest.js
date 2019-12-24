'use strict'

process.env.TEST = true
require('dotenv').config()
const { wrapContext } = require('../src/context')
const context = wrapContext()

async function main() {
  let { weather } = context
  let base = await weather.getBase()
  console.log(base)
}

main().catch(e => console.error(e))
