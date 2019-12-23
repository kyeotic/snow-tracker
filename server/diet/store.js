'use strict'

const { BaseStore } = require('../airtable/baseStore')
const dateformat = require('dateformat')

class DietStore extends BaseStore {
  constructor({ baseId, tableName, airtable }) {
    super({ baseId, tableName, airtable, useTypeCast: true })
    this.dietLog = this.table
  }

  fromDb(record) {
    let base = super.fromDb(record)
    return {
      id: base.id,
      date: new Date(base.Date),
      fat: base.Fat,
      weight: base.Weight,
      protien: base.Protien,
      carbs: base.Carbs,
      calories: base.Calories
    }
  }

  toDb(record) {
    return super.toDb({
      Date: dateformat(record.date, 'yyyy-mm-dd'),
      Weight: record.weight,
      Fat: record.fat,
      Protien: record.protien,
      Carbs: record.Carbs,
      Calories: record.calories
    })
  }
}

module.exports = {
  DietStore
}
