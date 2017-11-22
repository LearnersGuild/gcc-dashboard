'use strict'
require('dotenv').config()
const moment = require('moment-timezone')
const knex = require('../db')
const _ = require('lodash')
const utils = require('./utils/performanceReport')

const createContainer = async (type, segments) => {
  let segmentContainer = []
  
  segments.forEach(segment => {
    let segmentObject = Object.assign({}, utils[`${type}Template`])
    segmentObject.segment = segment
    segmentContainer.push(segmentObject)
  })
  return segmentContainer
}

const createAdvancementTableData = async (cohorts, learnerData) => {
  const phases = utils.advancementPhases
  const cohort = await createContainer('advancement', cohorts)
  const demo = await createContainer('advancement', utils.demoSegments)

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
        
        let weeks = utils.advancementNumberOfWeeks(learner, phase)
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

        if (weeks <= 6) {
          cohort[cohortIndex][`phase${phase}In6OrLess`]++
          cohort[cohortIndex].totalIn6OrLess++
          demo[genderIndex][`phase${phase}In6OrLess`]++
          demo[genderIndex].totalIn6OrLess++
          demo[raceIndex][`phase${phase}In6OrLess`]++
          demo[raceIndex].totalIn6OrLess++
          
          if (learner.two_or_more_races) {
            demo[twoOrMoreRacesIndex][`phase${phase}In6OrLess`]++
            demo[twoOrMoreRacesIndex].totalIn6OrLess++
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

const createAssessmentTableData = async learnerData => {
  const weekInPhase = await createContainer('assessment', utils.assessmentSegments)
  learnerData.forEach(learner => {
    let phase = learner.phase
    if (phase) {
      let currentPhase = parseInt(_.trimStart(phase, 'Phase '))
      let currentWeek = utils.assessmentNumberOfWeeks(learner, currentPhase)
      let currentWeekIndex = _.indexOf(utils.assessmentSegments, currentWeek)
      let totalIndex = _.indexOf(utils.assessmentSegments, 'Total')

      if (currentPhase < 4) {
        weekInPhase[currentWeekIndex][`phase${currentPhase}InPhase`]++
        weekInPhase[totalIndex][`phase${currentPhase}InPhase`]++
        if (learner[`phase_${currentPhase + 1}_attempt`]) {
          if (learner[`phase_${currentPhase + 1}_attempt`] === 'First') {
            weekInPhase[currentWeekIndex][`phase${currentPhase}Attempt1`]++
            weekInPhase[totalIndex][`phase${currentPhase}Attempt1`]++
          } else if (learner[`phase_${currentPhase + 1}_attempt`] === 'Second') {
            weekInPhase[currentWeekIndex][`phase${currentPhase}Attempt2`]++
            weekInPhase[totalIndex][`phase${currentPhase}Attempt2`]++
          } else if (learner[`phase_${currentPhase + 1}_attempt`] === 'Third') {
            weekInPhase[currentWeekIndex][`phase${currentPhase}Attempt3`]++
            weekInPhase[totalIndex][`phase${currentPhase}Attempt3`]++
          } else if (learner[`phase_${currentPhase + 1}_attempt`] === 'Fourth') {
            weekInPhase[currentWeekIndex][`phase${currentPhase}Attempt4`]++
            weekInPhase[totalIndex][`phase${currentPhase}Attempt4`]++
          } else {
            weekInPhase[currentWeekIndex][`phase${currentPhase}Attempt5`]++
            weekInPhase[totalIndex][`phase${currentPhase}Attempt5`]++
          }
        } else {
          weekInPhase[currentWeekIndex][`phase${currentPhase}HasNotAttempted`]++
          weekInPhase[totalIndex][`phase${currentPhase}HasNotAttempted`]++
        }
      }
    }
  })
  return weekInPhase
}

const createCurrentLearnersTableData = async learnerData => {
  const currentLearners = {
    phase1: _.filter(learnerData, o => { return o.phase === 'Phase 1'}).length,
    phase2: _.filter(learnerData, o => { return o.phase === 'Phase 2'}).length,
    phase3: _.filter(learnerData, o => { return o.phase === 'Phase 3'}).length,
    phase4: _.filter(learnerData, o => { return o.phase === 'Phase 4'}).length,
    phase5: _.filter(learnerData, o => { return o.phase === 'Phase 5'}).length
  }
  return currentLearners
}

const createAvgWeeksTableData = async learnerData => {
  const phaseData = {
    phase1: [],
    phase2: [],
    phase3: [],
    phase4: [],
    phase5: []
  }

  learnerData.forEach(learner => {
    utils.advancementPhases.forEach(phase => {
      if (learner.phase !== `Phase ${phase}`) {
        if (phase === 1 && learner.date_phase_2) {
          phaseData.phase1.push(utils.advancementNumberOfWeeks(learner, phase))
        } else if (phase === 5 && learner.date_phase_5 && learner.resignation_date) {
          phaseData.phase5.push(utils.advancementNumberOfWeeks(learner, phase))
        } else if (learner[`date_phase_${phase}`] && learner[`date_phase_${phase + 1}`]) {
          phaseData[`phase${phase}`].push(utils.advancementNumberOfWeeks(learner, phase))
        }
      }
    })
  })

  const weeksInPhase = {
    phase1: _.mean(phaseData.phase1).toFixed(1),
    phase2: _.mean(phaseData.phase2).toFixed(1),
    phase3: _.mean(phaseData.phase3).toFixed(1),
    phase4: _.mean(phaseData.phase4).toFixed(1),
    phase5: _.mean(phaseData.phase5).toFixed(1),
  }
  return weeksInPhase
}

const getCohorts = () => {
  return knex('status_of_learners').select(knex.raw('to_char(enrollee_start_date, \'YYYY-MM\')'))
    .where('created_at', '>=', moment.tz('America/Los_Angeles').format('YYYY-MM-DD'))
    .groupByRaw('to_char(enrollee_start_date, \'YYYY-MM\')')
    .then(rows => {
      const cohorts = []
      rows.forEach(row => cohorts.push(row.to_char))
      return cohorts.sort((a,b) => { return a - b })
    })
    .catch(err => console.log(err))
}
const getLearnerData = () => {
  return knex.select(...utils.fields).from('status_of_learners')
    .where('created_at', '>=', moment.tz('America/Los_Angeles').format('YYYY-MM-DD'))
    .then(learners => {
      return learners
    })
    .catch(err => { console.log(err) })
}

export const report = async cb => {
  try {
    const cohorts = await getCohorts()
    const learnerData = await getLearnerData()
    const reportData = await createAdvancementTableData(cohorts, learnerData)
    reportData.weekInPhase = await createAssessmentTableData(learnerData)
    reportData.currentLearners =  await createCurrentLearnersTableData(learnerData)
    reportData.avgWeeks = await createAvgWeeksTableData(learnerData)
    cb(null, reportData)
  } catch(err) {
    console.log(err)
    cb(err)
  }
}

