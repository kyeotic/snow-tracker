'use strict'

module.exports = {
  airtable: {
    apiKey: process.env.AIRTABLE_KEY || '',
    dietBaseId: process.env.AIRTABLE_DIET_BASE_ID || '',
    dietTable: 'Diet Log'
  }
}
