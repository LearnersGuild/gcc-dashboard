'use strict'
require('dotenv').config()
const moment = require('moment-timezone')
const knex = require('../db')
const _ = require('lodash')

const fields = [
  'phase',
  'gender',
  'race_ethnicity',
]

const getTotal = () => {
  let today = moment.tz('America/Los_Angeles').format('YYYY-MM-DD')
  return knex('status_of_learners')
    .count()
    .whereNotNull('phase')
    .andWhere('created_at', '>=', today)
    .then(result => {
      return result[0].count
    })
    .catch(err => console.log(err))
}

const getByCategory = (category) => {
  let today = moment.tz('America/Los_Angeles').format('YYYY-MM-DD')
  return knex('status_of_learners')
    .select(knex.raw(`${category} AS segment, count(*)`))
    .whereRaw('phase IS NOT NULL')
    .andWhere('created_at', '>=', today)
    .groupBy(category)
    .then(result => {
      let nullIndex = _.findIndex(result, o => o.segment === null)
      if (nullIndex >= 0) {
        result[nullIndex].segment = 'Undefined' 
      }
      return result
    })
    .catch(err => console.log(err))
}

export const report =  async (cb) => {
  try {
    let reportData = {}
    reportData.total = await getTotal()
    reportData.byPhase = await getByCategory('phase')
    reportData.byGender = await getByCategory('gender')
    reportData.byRace = await getByCategory('race')
    cb(null, reportData)
  } catch(err) {
    console.log(err)
    cb(err)
  }
}
