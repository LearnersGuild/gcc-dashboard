'use strict'
require('dotenv').config()
const moment = require('moment')
const knex = require('../db')
const _ = require('lodash')
const utils = require('./utils/performanceReport')

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
    let race
    if (learner.race) {
      race = learner.race
    } else {
      race = 'Race Undefined'
    }
    let raceIndex = utils.demoSegments.indexOf(race)
    let twoOrMoreRacesIndex = utils.demoSegments.indexOf('Two or More Races')
    let cohortIndex = cohorts.indexOf(moment(learner.enrollee_start_date).format('YYYY-MM'))

    phases.forEach(phase => {
      if (utils.didLearnerAdvance(learner, phase)) {
        cohort[cohortIndex][`phase${phase}Advanced`]++
        cohort[cohortIndex].totalAdvanced++
        demo[genderIndex][`phase${phase}Advanced`]++
        demo[genderIndex].totalAdvanced++
        demo[raceIndex][`phase${phase}Advanced`]++
        demo[raceIndex].totalAdvanced++
        
        let weeks = utils.numberOfWeeks(learner, phase)
        cohort[cohortIndex][`phase${phase}AdvancedWeeks`] += weeks
        cohort[cohortIndex].totalAdvancedWeeks += weeks
        demo[genderIndex][`phase${phase}AdvancedWeeks`] += weeks
        demo[genderIndex].totalAdvancedWeeks += weeks
        demo[raceIndex][`phase${phase}AdvancedWeeks`] += weeks
        demo[raceIndex].totalAdvancedWeeks += weeks

        if (learner.two_or_more_races) {
          demo[twoOrMoreRacesIndex][`phase${phase}Advanced`]++
          demo[twoOrMoreRacesIndex].totalAdvanced++
          demo[twoOrMoreRacesIndex][`phase${phase}AdvancedWeeks`] += weeks
          demo[twoOrMoreRacesIndex].totalAdvancedWeeks += weeks
        }

        if (weeks < 6) {
          cohort[cohortIndex][`phase${phase}LessThan6`]++
          cohort[cohortIndex].totalLessThan6++
          demo[genderIndex][`phase${phase}LessThan6`]++
          demo[genderIndex].totalLessThan6++
          demo[raceIndex][`phase${phase}LessThan6`]++
          demo[raceIndex].totalLessThan6++
          
          if (learner.two_or_more_races) {
            demo[twoOrMoreRacesIndex][`phase${phase}LessThan6`]++
            demo[twoOrMoreRacesIndex].totalLessThan6++
          }
        } else if (weeks === 6) {
          cohort[cohortIndex][`phase${phase}In6`]++
          cohort[cohortIndex].totalIn6++
          demo[genderIndex][`phase${phase}In6`]++
          demo[genderIndex].totalIn6++
          demo[raceIndex][`phase${phase}In6`]++
          demo[raceIndex].totalIn6++
          
          if (learner.two_or_more_races) {
            demo[twoOrMoreRacesIndex][`phase${phase}In6`]++
            demo[twoOrMoreRacesIndex].totalIn6++
          }
        } else if (weeks < 9) {
          cohort[cohortIndex][`phase${phase}In7Or8`]++
          cohort[cohortIndex].totalIn7Or8++
          demo[genderIndex][`phase${phase}In7Or8`]++
          demo[genderIndex].totalIn7Or8++
          demo[raceIndex][`phase${phase}In7Or8`]++
          demo[raceIndex].totalIn7Or8++
          
          if (learner.two_or_more_races) {
            demo[twoOrMoreRacesIndex][`phase${phase}In7Or8`]++
            demo[twoOrMoreRacesIndex].totalIn7Or8++
          }
        } else {
          cohort[cohortIndex][`phase${phase}MoreThan8`]++
          cohort[cohortIndex].totalMoreThan8++
          demo[genderIndex][`phase${phase}MoreThan8`]++
          demo[genderIndex].totalMoreThan8++
          demo[raceIndex][`phase${phase}MoreThan8`]++
          demo[raceIndex].totalMoreThan8++
          
          if (learner.two_or_more_races) {
            demo[twoOrMoreRacesIndex][`phase${phase}MoreThan8`]++
            demo[twoOrMoreRacesIndex].totalMoreThan8++
          }
        }

        if (phase < 4) {
          let tries = utils.numberOfTries(learner, phase)
          cohort[cohortIndex][`phase${phase}AdvancedTries`] += tries
          cohort[cohortIndex].totalAdvancedTries += tries
          cohort[cohortIndex][`phase${phase}AssessmentAdvanced`]++
          cohort[cohortIndex].totalAssessmentAdvanced++
          demo[genderIndex][`phase${phase}AdvancedTries`] += tries
          demo[genderIndex].totalAdvancedTries += tries
          demo[genderIndex][`phase${phase}AssessmentAdvanced`]++
          demo[genderIndex].totalAssessmentAdvanced++
          demo[raceIndex][`phase${phase}AdvancedTries`] += tries
          demo[raceIndex].totalAdvancedTries += tries
          demo[raceIndex][`phase${phase}AssessmentAdvanced`]++
          demo[raceIndex].totalAssessmentAdvanced++
          if (learner.two_or_more_races) {
            demo[twoOrMoreRacesIndex][`phase${phase}AssessmentAdvanced`]++
            demo[twoOrMoreRacesIndex].totalAssessmentAdvanced++
          }
          if (tries > 1) {
            cohort[cohortIndex][`phase${phase}MoreThan1Try`]++
            cohort[cohortIndex].totalMoreThan1Try++
            demo[genderIndex][`phase${phase}MoreThan1Try`]++
            demo[genderIndex].totalMoreThan1Try++
            demo[raceIndex][`phase${phase}MoreThan1Try`]++
            demo[raceIndex].totalMoreThan1Try++
            if (learner.two_or_more_races) {
              demo[twoOrMoreRacesIndex][`phase${phase}MoreThan1Try`]++
              demo[twoOrMoreRacesIndex].totalMoreThan1Try++
            }
          } else if (tries === 1) {
            cohort[cohortIndex][`phase${phase}In1Try`]++
            cohort[cohortIndex].totalIn1Try++
            demo[genderIndex][`phase${phase}In1Try`]++
            demo[genderIndex].totalIn1Try++
            demo[raceIndex][`phase${phase}In1Try`]++
            demo[raceIndex].totalIn1Try++
            if (learner.two_or_more_races) {
              demo[twoOrMoreRacesIndex][`phase${phase}In1Try`]++
              demo[twoOrMoreRacesIndex].totalIn1Try++
            }
          }
        }
      } else {
        if (utils.hasNotAdvanced(learner, phase)) {
          cohort[cohortIndex][`phase${phase}HasNotAdvanced`]++
          cohort[cohortIndex].totalHasNotAdvanced++
          demo[genderIndex][`phase${phase}HasNotAdvanced`]++
          demo[genderIndex].totalHasNotAdvanced++
          demo[raceIndex][`phase${phase}HasNotAdvanced`]++
          demo[raceIndex].totalHasNotAdvanced++
          if (learner.two_or_more_races) {
            demo[twoOrMoreRacesIndex][`phase${phase}HasNotAdvanced`]++
            demo[twoOrMoreRacesIndex]['totalHasNotAdvanced']++
          }
        } else if (utils.graduatedEarly(learner, phase)) {
          cohort[cohortIndex][`phase${phase}GraduatedEarly`]++
          cohort[cohortIndex].totalGraduatedEarly++
          demo[genderIndex][`phase${phase}GraduatedEarly`]++
          demo[genderIndex].totalGraduatedEarly++
          demo[raceIndex][`phase${phase}GraduatedEarly`]++
          demo[raceIndex].totalGraduatedEarly++
          if (learner.two_or_more_races) {
            demo[twoOrMoreRacesIndex][`phase${phase}GraduatedEarly`]++
          }
        }
      }
    })
  })
  const tableData = {demo, cohort}
  return tableData
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
  return knex.select(...utils.fields).from('status_of_learners')
    .where('created_at', '>=', moment().subtract(8, 'hours').format('YYYY-MM-DD'))
    .then(learners => {
      return learners
    })
    .catch(err => { console.log(err) })
}

export const report = async (cb) => {
  let cohorts = await getCohorts()
  let learnerData = await getLearnerData()
  let reportData = await createTableData(cohorts, learnerData)
  cb(reportData)
}

