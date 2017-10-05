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
  'learner_s_starting_salary'
]

const numFields = [
  'llf_payment_count',
  'llf_income_percent',
  'pif_payment_count',
  'pif_income_percent',
  'learner_s_starting_salary'
]

const dateFields = [
  'enrollee_start_date',
  'resignation_date',
  'llf_first_payment_due_date',
  'pif_first_payment_due_date'
]

const getJobData = dates => {
  return knex.select(...fields).from('status_of_learners')
    .whereRaw('("rollupStage" = ? OR "rollupStage" = ?) AND created_at >= ? AND created_at < ?' ,
    ['Job Accepted, prior to first ISA Payment', 'ISA in Payment', dates.reportStart, dates.reportEnd])
    .orderBy('enrollee_start_date', 'asc')
    .then(rows => {
      rows.forEach(row => {
        numFields.forEach(field => {
          if (row[field] === '') {
            row[field] = 0
          } else {
            row[field] = parseFloat(row[field])
          }
        })
      })
      return rows
    })
    .catch(err => console.log(err))
}

// getJobData({reportStart: '2017-10-04', reportEnd: '2017-10-05'}).then(data => { 
//   data.forEach(record => {
//     let start = moment(record.enrollee_start_date)
//     let end = moment(record.resignation_date)
//     console.log(end.diff(start, 'week'))
//   })
// })

const formatDataTotals = (data) => {

}

const formatDataByCohort = (data) => {
  const cohortData = []
  let segmentData = {}
  const salary = []
  const pifPercent = []
  const llfPercent = []

  data.forEach((learner, index) => {
    const cohort = moment(learner.enrollee_start_date).format('MMM-YY')
    if (segmentData.cohort === cohort) {
      segment.inJob++
      if (learner.rollupStage === 'ISA in Payment') {
        segment.inPayment++
      }
      if (parseFloat(learner.llf_payment_count) > 0 || parseFloat(learner.pif_payment_count) > 0) {
        segment.haveMadePayments++
      }
      
    } else {
      if (index > 0) {
        segment.inJob++

        cohortData.push(segmentData)
        segmentData = {
          cohort: cohort,
          inJob: 0,
          inPayment: 0,
          haveMadePayments: 0,
          noPaymentsMade: 0,
          pastDueButHaveMadePayments: 0
        }
      } else {

      }
    }
  })
  return cohortData
}

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


// const getLearnerData = dates => {
//   return knex.select(...fields).from('status_of_learners')
//     .where('created_at', '>=', dates.reportStart)
//     .andWhere('created_at', '<', dates.reportEnd)
//     .then(rows => {
//       rows.forEach(row => {
//         numFields.forEach(field => {
//           if (row[field] === '') {
//             row[field] = 0
//           } else {
//             row[field] = parseFloat(row[field])
//           }
//         })
//         dateFields.forEach(field => {
//           if (row[field]) {
//             row[field] = moment(row[field]).format('YYYY-MM-DD')
//           }
//         })
//       })
//       return rows
//     })
//     .catch(err => console.log(err))
// }

// const getFunnelByStage = dates => {
//   return knex.select('stage', 'stageStatus').from('status_of_learners').count('stage')
//       .where('created_at', '>=', dates.reportStart)
//       .andWhere('created_at', '<', dates.reportEnd)
//       .groupBy('stage')
//       .groupBy('stageStatus')
//     .then(rows => {
//       const stages = {}
//       rows.forEach(row => {
//         if (stages[row.stage]) {
//           stages[row.stage][row.stageStatus] = row.count
//         } else {
//           stages[row.stage] = {}
//           stages[row.stage][row.stageStatus] = row.count
//         }
//       })
//       const stageKeys = Object.keys(stages)
//       const formatted = []
//       stageKeys.forEach(key => {
//         const currentlyIn = parseInt(stages[key]['Curently In'], 10) || 0
//         const outDuringStage = parseInt(stages[key]['Out During Stage'], 10) || 0
//         formatted.push({stage: key, 'Currently In': currentlyIn, 'Out During Stage': outDuringStage})
//       })
//       return formatted
//     })
//     .catch(err => console.log(err))
// }

// const getRetentionByCohort = dates => {
//   return knex('status_of_learners').select(knex.raw('stage, to_char(enrollee_start_date, \'Mon-YY\'), "stageStatus", COUNT(*)'))
//       .where('created_at', '>=', dates.reportStart)
//       .andWhere('created_at', '<', dates.reportEnd)
//       .groupByRaw('stage, "stageStatus", to_char(enrollee_start_date, \'Mon-YY\')')
//     .then(rows => {
//       const stages = {}
//       rows.forEach(row => {
//         if (stages[`${row.stage} ${row.to_char}`]) {
//           stages[`${row.stage} ${row.to_char}`][row.stageStatus] = row.count
//         } else {
//           stages[`${row.stage} ${row.to_char}`] = {}
//           stages[`${row.stage} ${row.to_char}`][row.stageStatus] = row.count
//         }
//       })
//       const stageKeys = Object.keys(stages)
//       const formatted = []
//       stageKeys.forEach(key => {
//         const currentlyIn = parseInt(stages[key]['Curently In'], 10) || 0
//         const outDuringStage = parseInt(stages[key]['Out During Stage'], 10) || 0
//         formatted.push({stage: key, 'Currently In': currentlyIn, 'Out During Stage': outDuringStage})
//       })
//       return formatted
//     })
//     .catch(err => console.log(err))
// }

// export const file = (dates, cb) => {
//   Promise.all([
//     getLearnerData(dates),
//     getFunnelByStage(dates),
//     getRetentionByCohort(dates)
//   ])
//   .then(values => cb(values))
//   .catch(err => console.log(err))
// }
