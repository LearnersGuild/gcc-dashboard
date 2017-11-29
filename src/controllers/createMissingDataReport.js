'use strict'
require('dotenv').config()
const moment = require('moment-timezone')
const knex = require('../db')
const _ = require('lodash')

const fields = [
  'firstname',
  'lastname',
  'learner_s_starting_salary',
  'learner_reported_salary',
  'job_title',
  'job_start_date',
  'employment_type',
  'employed_in_or_out_of_field',
  'weekly_part_time_hours'
]

const getMissingData = () => {
  let today = moment.tz('America/Los_Angeles').format('YYYY-MM-DD')
  return knex.select(...fields).from('status_of_learners')
    .whereRaw('created_at >= ? AND ("metaStage" = ? OR "metaStage" = ?)',
    [today, 'Job Search', 'ISA Payment'])
    .then(rows => {
      return rows
    })
    .catch(err => console.log(err))
}

export const report =  async (cb) => {
  try {
    const reportData = await getMissingData()
    cb(null, reportData)
  } catch(err) {
    console.log(err)
    cb(err)
  }
}
