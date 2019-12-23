'use strict'

class BaseStore {
  constructor({ airtable, baseId, tableName }) {
    this.base = airtable.base(baseId)
    this.table = this.base.table(tableName)
  }

  async getAll() {
    let records = await this.table.query().all()
    console.log('base', records.map(r => r.fields))
    return records.map(this.fromDb)
  }

  async put(record) {
    let method = record.id === undefined ? 'create' : 'update'
    let update = await this.table[method](this.toDb(record))
    return record
  }

  fromDb(record) {
    return {
      id: record.id,
      ...record.fields
    }
  }

  toDb(record) {
    record = { ...record }
    delete record.id
    return record
  }
}

module.exports = {
  BaseStore
}
