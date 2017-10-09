'use strict'
require('dotenv').config()
const moment = require('moment')
const knex = require('../db')
const _ = require('lodash')

const fields = [
  'email',
  'gender',
  'race_ethnicity',
  'income_level',
  'enrollee_start_date',
  'resignation_date',
  'rollupStage',
  'has_llf',
  'llf_payment_count',
  'llf_income_percent',
  'llf_first_payment_due_date',
  'llf_status',
  'has_pif',
  'pif_payment_count',
  'pif_income_percent',
  'pif_first_payment_due_date',
  'pif_status',
  'learner_s_starting_salary',
  'total_payments_received',
  'isa_payments_past_due'
]

const numFields = [
  'llf_payment_count',
  'llf_income_percent',
  'pif_payment_count',
  'pif_income_percent',
  'learner_s_starting_salary',
  'total_payments_received'
]

const dateFields = [
  'enrollee_start_date',
  'resignation_date',
  'llf_first_payment_due_date',
  'pif_first_payment_due_date'
]

const getJobData = (dates, order) => {
  return knex.select(...fields).from('status_of_learners')
    .whereRaw('("rollupStage" = ? OR "rollupStage" = ?) AND created_at >= ? AND created_at < ?' ,
    ['Job Accepted, prior to first ISA Payment', 'ISA in Payment', dates.reportStart, dates.reportEnd])
    .orderBy(order, 'asc')
    .then(rows => {
      return rows
    })
    .catch(err => console.log(err))
}

const formatDataTotals = (data) => {

}

const getSegment = (learner, type) => {
  if (type === 'cohort') {
      return moment(learner.enrollee_start_date).format('MMM-YY')
  }

  if (type === 'gender') {
    if (learner.gender) {
      return learner.gender
    } else {
      return 'Undefined'
    }
  }

  if (type === 'race_ethnicity') {
    if (!learner.race_ethnicity) {
      return 'Undefined'
    } else if (learner.race_ethnicity.includes(';')) {
      return 'Multi-Racial'
    } else {
      return learner.race_ethnicity
    }
  }

  if (type === 'income_level') {
    if (learner.income_level) {
      return learner.income_level
    } else {
      return 'Undefined'
    }
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
    console.log(segment)

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

    // let start = moment(record.enrollee_start_date)
    // let end = moment(record.resignation_date)
    // console.log(end.diff(start, 'week'))

getJobData({reportStart: '2017-10-06', reportEnd: '2017-10-07'}, 'enrollee_start_date' ).then(data => {
  let byCohort = formatData(data, 'cohort')
  console.log(byCohort)
}).catch(err => {console.log(err)})

getJobData({reportStart: '2017-10-06', reportEnd: '2017-10-07'}, 'gender' ).then(data => {
  let byGender = formatData(data, 'gender')
  console.log(byGender)
}).catch(err => {console.log(err)})

getJobData({reportStart: '2017-10-06', reportEnd: '2017-10-07'}, 'race_ethnicity' ).then(data => {
  let byRace = formatData(data, 'race_ethnicity')
  console.log(byRace)
}).catch(err => {console.log(err)})

getJobData({reportStart: '2017-10-06', reportEnd: '2017-10-07'}, 'income_level' ).then(data => {
  let byIncome = formatData(data, 'income_level')
  console.log(byIncome)
}).catch(err => {console.log(err)})

const report = (dates, cb) => {
  getJobData(dates)
    .then(result => {
      const reportData = {}
      reportData.byCohort = formatDataByCohort(result)
      reportData.byGender = formatDataByGender(result)
      reportData.byRace = formatDataByRace(result)
      reportData.byIncome = formatDataByIncome(result)
      reportData.byWeeksInProgram = formatDataByWeeksInProgram(result)
      cb(reportData)
    })
    .catch(err => {
      console.log('Error in Jobs Report', err)
    })
}




// export const file = (dates, cb) => {
//   Promise.all([
//     getLearnerData(dates),
//     getFunnelByStage(dates),
//     getRetentionByCohort(dates)
//   ])
//   .then(values => cb(values))
//   .catch(err => console.log(err))
// }
