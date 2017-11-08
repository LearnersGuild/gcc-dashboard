'use strict'
require('dotenv').config()
const moment = require('moment')
const knex = require('../db')
const _ = require('lodash')

const fields = [
  'date_phase_1',
  'date_phase_2',
  'date_phase_3',
  'date_phase_4',
  'date_phase_5',
  'phase_1_attempt ',
  'phase_2_attempt',
  'phase_3_attempt',
  'phase_4_attempt',
  'phase_1_interview_outcome',
  'phase_2_interview_outcome',
  'phase_3_interview_outcome',
  'phase_4_interview_outcome',
  'gender',
  'race',
  'two_or_more_races',
  'enrollee_start_date',
  'phase'
]

const phases = [
  'phase_1',
  'phase_2',
  'phase_3',
  'phase_4',
  'phase_5'
]


let totalPhaseAssessmentAttempts = 0

// First, Second, Third, Fourth, Fifth
// Accept, Not Accept

const hasNotAdvanced = (learner, phase) => {
  if (learner[`phase_${phase + 1}_interview_outcome` === 'Not Accept']) {
    return true
  } else if (learner.phase === `Phase ${phase}` && !learner[`phase_${phase + 1}_interview_outcome`]) {
    return true
  } else {
    return false
  }
}

// const getPhase1Data = (learnerData, type) => {
//   const weeks = []
//   const tries = []
//   const phase1 = [
//     {
//       segment: 'Man',
//       lessThan6: _.filter(learnerData, learner => { 
//         if (learner.gender === 'Man' && learner.date_phase_2) {
//           if (learner.date_phase_1) {
//             return Math.round(moment(learner.date_phase_1).diff(moment(learner.date_phase_2), 'days')/7) < 6 
//           } else {
//             return Math.round(moment(learner.enrollee_start_date).diff(moment(learner.date_phase_2), 'days')/7) < 6 
//           }
//         } else {
//           return false
//         }
//       }).length,
//       in6: 0,
//       in7or8: 0,
//       moreThan8: 0,
//       in1Try: 0,
//       moreThan1Try: 0
//     }
//   ]
// }

const getCohorts = () => {
  return knex('status_of_learners').select(knex.raw('to_char(enrollee_start_date, \'YYYY-MM\')'))
    .where('created_at', '>=', '2017-11-07')
    .groupByRaw('to_char(enrollee_start_date, \'YYYY-MM\')')
    .then(rows => {
      const cohorts = []
      rows.forEach(row => cohorts.push(row.to_char))
      return cohorts
    })
    .catch(err => console.log(err))
}
const getLearnerData = () => {
  return knex.select(...fields).from('status_of_learners')
    .where('created_at', '>=', moment().subtract(8, 'hours').format('YYYY-MM-DD'))
    .then(learners => {
      //do the thing
    })
    .catch(err => { console.log(err) })
}

export const report = async (cb) => {
  let cohorts = await getCohorts()
  // [ '2016-07',
  // '2016-09',
  // '2016-11',
  // '2017-02',
  // '2017-03',
  // '2017-04',
  // '2017-05',
  // '2017-08',
  // '2017-09' ]
  // let learnerData = await getLearnerData()
  // let reportData = {}
  // cb(reportData)
}


