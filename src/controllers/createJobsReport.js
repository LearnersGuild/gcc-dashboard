'use strict'
require('dotenv').config()
const moment = require('moment')
const knex = require('../db')
const _ = require('lodash')

const fields = [
  'gender',
  'race_ethnicity',
  'income_level',
  'enrollee_start_date',
  'resignation_date',
  'llf_payment_count',
  'llf_income_percent',
  'llf_status',
  'pif_payment_count',
  'pif_income_percent',
  'pif_status',
  'learner_s_starting_salary',
  'total_payments_received',
  'isa_payments_past_due'
]

const getJobData = (dates, order, type) => {
  let weeks = knex.raw('resignation_date::DATE - enrollee_start_date::DATE').wrap('(', ')/7::INT AS weeks')
  return knex.select(...fields, weeks).from('status_of_learners')
    .whereRaw('("rollupStage" = ? OR "rollupStage" = ?) AND created_at >= ? AND created_at < ?' ,
    ['Job Accepted, prior to first ISA Payment', 'ISA in Payment', dates.reportStart, dates.reportEnd])
    .orderBy(order, 'asc')
    .then(rows => {
      return formatData(rows, type)
    })
    .catch(err => console.log(err))
}

const getSegment = (learner, type) => {
  if (type === 'byCohort') {
      return moment(learner.enrollee_start_date).format('MMM-YY')
  }
  if (type === 'byGender') {
    if (learner.gender) {
      return learner.gender
    } else {
      return 'Undefined'
    }
  }
  if (type === 'byRace') {
    if (!learner.race_ethnicity) {
      return 'Undefined'
    } else if (learner.race_ethnicity.includes(';')) {
      return 'Multi-Racial'
    } else {
      return learner.race_ethnicity
    }
  }
  if (type === 'byIncome') {
    if (learner.income_level) {
      return learner.income_level
    } else {
      return 'Undefined'
    }
  }
  if (type === 'byWeeksInProgram') {
    if (learner.weeks < 20 ) {
      return '< 20'
    } else if (learner.weeks < 30) {
      return '20 - 29'
    } else if (learner.weeks < 40) {
      return '30 - 39'
    } else if (learner.weeks === 40) {
      return '40'
    } else {
      return '> 40'
    }
  }
  if (type === 'Total') {
    return 'Total'
  }
}

const formatData = (data, type) => {
  const segments = []
  let segmentData = {
          segment: '',
          inJob: 0,
          inPayment: 0,
          currentOnPayments: 0,
          noPaymentsMade: 0,
          pastDueButHaveMadePayments: 0
        }
  let salary = []
  let pifPercent = []
  let llfPercent = []

  data.forEach((learner, index) => {
    let segment = getSegment(learner, type)

    if (index === 0) {
      segmentData.segment = segment
    }
    if (segmentData.segment !== segment) {
      segmentData.avgSalary = isNaN(_.round(_.mean(salary))) ? 0 : _.round(_.mean(salary))
      segmentData.avgPIFPercent = isNaN(_.mean(pifPercent).toFixed(4)) ? 0 : _.mean(pifPercent).toFixed(4)
      segmentData.avgLLFPercent = isNaN(_.mean(llfPercent).toFixed(4)) ? 0 : _.mean(llfPercent).toFixed(4)
      segments.push(segmentData)
      segmentData = {
        segment: segment,
        inJob: 0,
        inPayment: 0,
        currentOnPayments: 0,
        noPaymentsMade: 0,
        pastDueButHaveMadePayments: 0
      }
      salary = []
      pifPercent = []
      llfPercent = []
    }
    segmentData.inJob++

    if ((learner.pif_status === 'Payment' || learner.llf_status === 'Payment')) {
      segmentData.inPayment++
      if (!learner.isa_payments_past_due) {
        segmentData.currentOnPayments++
      }
      if (learner.isa_payments_past_due) {
        if (
          parseInt(learner.pif_payment_count, 10)  ||
          parseInt(learner.llf_payment_count, 10)
        ) {
          segmentData.pastDueButHaveMadePayments++
        } else {
          segmentData.noPaymentsMade++
        }
      }
    }
    if (learner.learner_s_starting_salary) {
      salary.push(parseFloat(learner.learner_s_starting_salary))
    }
    if (learner.pif_income_percent) {
      pifPercent.push(parseFloat(learner.pif_income_percent))
    }
    if (learner.llf_income_percent) {
      llfPercent.push(parseFloat(learner.llf_income_percent))
    }
    if (index === data.length - 1) {
      segmentData.avgSalary = _.round(_.mean(salary))
      segmentData.avgPIFPercent = _.mean(pifPercent).toFixed(4)
      segmentData.avgLLFPercent = _.mean(llfPercent).toFixed(4)
      segments.push(segmentData)
    }
  })
  return segments
}

export const report =  async (dates, cb) => {
  const reportData = {}
  reportData.byCohort         = await getJobData(dates, 'enrollee_start_date', 'byCohort')
  reportData.byGender         = await getJobData(dates, 'gender', 'byGender')
  reportData.byRace           = await getJobData(dates, 'race_ethnicity', 'byRace')
  reportData.byIncome         = await getJobData(dates, 'income_level', 'byIncome' )
  reportData.byWeeksInProgram = await getJobData(dates, 'weeks', 'byWeeksInProgram')
  reportData.total            = await getJobData(dates, 'enrollee_start_date', 'Total')
  cb(reportData)
}

// report({reportStart: '2017-10-09', reportEnd: '2017-10-10'}, (data) => { console.log(data)})
