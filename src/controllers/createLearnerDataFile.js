'use strict';
require('dotenv').config()
const XLSX = require('xlsx')
const moment = require('moment')
const fs = require('fs')
const knex = require('../db')

let startDate = '2017-09-10'
let endDate = '2017-09-11'
const fields = [
  'hubspot_canonical_vid',
  'email',
  'firstname',
  'lastname',
  'dob_mm_dd_yyyy_',
  'gender',
  'race_ethnicity',
  'highest_degree_earned',
  'income_level',
  'current_employment_status',
  'createdate',
  'enrollee_start_date',
  'cancellation_date',
  'phase',
  'resignation_date',
  'exit_type',
  'exit_phase',
  'ps_inactive_type',
  'stageStatus',
  'metaStage',
  'rollupStage',
  'stage',
  'has_llf',
  'llf_amount_eligible',
  'llf_amount_accepted',
  'llf_amount_received',
  'llf_payment_count',
  'llf_income_percent',
  'llf_date_signed',
  'llf_amount_paid',
  'llf_first_payment_due_date',
  'llf_status',
  'has_pif',
  'pif_amount_eligible',
  'pif_amount_accepted',
  'pif_amount_received',
  'pif_payment_count',
  'pif_income_percent',
  'pif_date_signed',
  'pif_amount_paid',
  'pif_first_payment_due_date',
  'pif_status',
  'learner_s_starting_salary',
  'have_you_accepted_a_job_offer',
  'has_received_llf_financing',
]

const getLearnerData = () => {
  return knex.select(...fields).from('status_of_learners')
    .where('created_at', '>', startDate)
    .andWhere('created_at', '<', endDate)
    .then(rows => {
      return rows;
    })
    .catch(err => console.log(err))
}

const getFunnelByStage = () => {
  return knex.select('stage', 'stageStatus').from('status_of_learners').count('stage')
      .where('created_at', '>', startDate)
      .andWhere('created_at', '<', endDate)
      .groupBy('stage')
      .groupBy('stageStatus')
    .then(rows => {
      let stages = {};
      rows.forEach(row => {
        if (stages[row.stage]) {
          stages[row.stage][row.stageStatus] = row.count
        } else {
          stages[row.stage] = {}
          stages[row.stage][row.stageStatus] = row.count
        }
      })
      let stageKeys = Object.keys(stages)
      let formatted = []
      stageKeys.forEach(key => {
        let currentlyIn = parseInt(stages[key]["Curently In"]) || 0
        let outDuringStage = parseInt(stages[key]["Out During Stage"]) || 0
        formatted.push({stage: key, "Currently In": currentlyIn, "Out During Stage": outDuringStage})
      })
      return formatted
    })
    .catch(err => console.log(err))
}

const getRetentionByCohort = () => {
  return knex('status_of_learners').select(knex.raw('stage, to_char(enrollee_start_date, \'Mon-YY\'), "stageStatus", COUNT(*)'))
      .where('created_at', '>=', startDate)
      .andWhere('created_at', '<', endDate)
      .groupByRaw('stage, "stageStatus", to_char(enrollee_start_date, \'Mon-YY\')')
    .then(rows => {
      let stages = {};
      rows.forEach(row => {
        if (stages[`${row.stage} ${row.to_char}`]) {
          stages[`${row.stage} ${row.to_char}`][row.stageStatus] = row.count
        } else {
          stages[`${row.stage} ${row.to_char}`] = {}
          stages[`${row.stage} ${row.to_char}`][row.stageStatus] = row.count
        }
      })
      let stageKeys = Object.keys(stages)
      let formatted = []
      stageKeys.forEach(key => {
        let currentlyIn = parseInt(stages[key]["Curently In"]) || 0
        let outDuringStage = parseInt(stages[key]["Out During Stage"]) || 0
        formatted.push({stage: key, "Currently In": currentlyIn, "Out During Stage": outDuringStage})
      })
       return formatted
    })
    .catch(err => console.log(err))
}

export const file = cb => {
  Promise.all([
   getLearnerData(),
   getFunnelByStage(),
   getRetentionByCohort()
  ])
  .then(values => cb(values))
  .catch(error => console.log(error))
}
