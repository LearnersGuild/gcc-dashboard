'use strict'
require('dotenv').config()
const moment = require('moment')
const knex = require('../db')
const _ = require('lodash')
// const demoSegments = require('./utils/performanceReport').demoSegments
// const template = require('./utils/performanceReport').template
const utils = require('./utils/performanceReport')

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
  'phase',
  'exit_type',
  'exit_phase',
  'metaStage'
]
// First, Second, Third, Fourth, Fifth
// Accept, Not Accept

const hasNotAdvanced = (learner, phase) => {
  if (phase === 5) {
    learner.phase === 'Phase 5' ? true : false
  } else if (phase === 4) {
    learner.phase === 'Phase 4' ? true : false
  } else {
    if (learner[`phase_${phase + 1}_interview_outcome` === 'Not Accept']) {
      return true
    } else if (learner.phase === `Phase ${phase}` && !learner[`phase_${phase + 1}_interview_outcome`]) {
      console.log(learner[`phase_${phase + 1}_interview_outcome`])
      return true
    } else {
      return false
    }
  }
}

const createContainer = async (segments) => {
  let segmentContainer = []
  
  segments.forEach(segment => {
    let segmentObject = Object.assign({}, utils.template)
    segmentObject.segment = segment
    segmentContainer.push(segmentObject)
  })
  return segmentContainer
}

const createTableData = async (cohorts, learnerData) => {
  const phases = utils.phases
  const cohort = await createContainer(cohorts)
  const demo = await createContainer(utils.demoSegments)
  
  let totalAssessmentAttempts = 0
  let totalAssessmentAdvancements = 0

  learnerData.forEach(learner => {
    let gender
    if (learner.gender === 'Transgender' || learner.gender === 'Other') {
      gender = 'Transgender or Other'
    } else if (learner.gender !== 'Man' && learner.gender !== 'Woman') {
      gender = 'Gender Undefined'
    } else {
      gender = learner.gender
    }
    let genderIndex = utils.demoSegments.indexOf(gender)
    let raceIndex = utils.demoSegments.indexOf(learner.race) === -1 ? utils.demoSegments.indexOf('Race Undefined') : utils.demoSegments.indexOf(learner.race)
    let twoOrMoreRacesIndex = utils.demoSegments.indexOf('Two or More Races')
    let cohortIndex = cohorts.indexOf(moment(learner.enrollee_start_date).format('YYYY-MM'))

    phases.forEach(phase => { 
      if (hasNotAdvanced(learner, phase)) {
        cohort[cohortIndex][`phase${phase}HasNotAdvanced`]++
        cohort[cohortIndex]['totalHasNotAdvanced']++
        demo[genderIndex][`phase${phase}HasNotAdvanced`]++
        demo[genderIndex]['totalHasNotAdvanced']++
        demo[raceIndex][`phase${phase}HasNotAdvanced`]++
        demo[raceIndex]['totalHasNotAdvanced']++
        if (learner.two_or_more_races) {
          demo[twoOrMoreRacesIndex][`phase${phase}HasNotAdvanced`]++
          demo[twoOrMoreRacesIndex]['totalHasNotAdvanced']++
        }
      // } else {

      //   isLessThan6(learner, phase)
      //   in6(learner, phase, segment)
      //   in7or8(learner, phase, segment)
      //   moreThan8(learner, phase, segment)
      //   in1Try(learner, phase, segment)
      //   moreThan1Try(learner, phase, segment)
      //   advancedTries(learner, phase, segment)
      //   advanced(learner, phase, segment)
      }
    })
  })
}

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
      return learners
    })
    .catch(err => { console.log(err) })
}

const report = async (cb) => {
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
  let learnerData = await getLearnerData()
  createTableData(cohorts, learnerData)
  // let reportData = {}
  // cb(reportData)
}

report()

