'use strict'

const { Client } = require('@kyeotic/airtable')

module.exports = {
  configure
}

function configure({ config }) {
  return new Client({
    apiKey: config.apiKey
  })
}
