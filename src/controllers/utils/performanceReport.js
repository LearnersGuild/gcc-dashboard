'use strict'
const moment = require('moment')
const _ = require('lodash')

exports.fields = [
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
  'metaStage',
  'resignation_date'
]

exports.demoSegments = [
  'Man', 'Woman', 'Transgender or Other', 'Gender Undefined', '', 'White', 'Hispanic or Latino', 'Black or African American',
  'American Indian and Alaska Native', 'Asian', 'Arab or Arab American',
  'Native Hawaiian or Other Pacific Islander', 'Some Other Race', 'Two or More Races', 'Race Undefined'
]

exports.advancementTemplate = {
  segment: '',
  phase1LessThan6: 0,
  phase2LessThan6: 0,
  phase3LessThan6: 0,
  phase4LessThan6: 0,
  phase5LessThan6: 0,
  totalLessThan6: 0,
  phase1In6: 0,
  phase2In6: 0,
  phase3In6: 0,
  phase4In6: 0,
  phase5In6: 0,
  totalIn6: 0,
  phase1In7Or8: 0,
  phase2In7Or8: 0,
  phase3In7Or8: 0,
  phase4In7Or8: 0,
  phase5In7Or8: 0,
  totalIn7Or8: 0,
  phase1MoreThan8: 0,
  phase2MoreThan8: 0,
  phase3MoreThan8: 0,
  phase4MoreThan8: 0,
  phase5MoreThan8: 0,
  totalMoreThan8: 0,
  phase1HasNotAdvanced: 0,
  phase2HasNotAdvanced: 0,
  phase3HasNotAdvanced: 0,
  phase4HasNotAdvanced: 0,
  phase5HasNotAdvanced: 0,
  totalHasNotAdvanced: 0,
  phase1In1Try: 0,
  phase2In1Try: 0,
  phase3In1Try: 0,
  totalIn1Try: 0,
  phase1MoreThan1Try: 0,
  phase2MoreThan1Try: 0,
  phase3MoreThan1Try: 0,
  totalMoreThan1Try: 0,
  phase1AdvancedTries: 0,
  phase2AdvancedTries: 0,
  phase3AdvancedTries: 0,
  totalAdvancedTries: 0,
  phase1AdvancedWeeks: 0,
  phase2AdvancedWeeks: 0,
  phase3AdvancedWeeks: 0,
  phase4AdvancedWeeks: 0,
  phase5AdvancedWeeks: 0,
  totalAdvancedWeeks: 0,
  phase1Advanced: 0,
  phase2Advanced: 0,
  phase3Advanced: 0,
  phase4Advanced: 0,
  phase5Advanced: 0,
  totalAdvanced: 0,
  phase1AssessmentAdvanced: 0,
  phase2AssessmentAdvanced: 0,
  phase3AssessmentAdvanced: 0,
  totalAssessmentAdvanced: 0,
  phase1GraduatedEarly: 0,
  phase2GraduatedEarly: 0,
  phase3GraduatedEarly: 0,
  phase4GraduatedEarly: 0,
  phase5GraduatedEarly: 0,
  totalGraduatedEarly: 0
}

exports.advancementPhases = [1, 2, 3, 4, 5]

exports.assessmentSegments = ['1', '2', '3', '4', '5', '6', '7', '8', '8+', 'Total']

exports.assessmentTemplate = {
  segment: '',
  phase0InPhase: 0,
  progressCheckInPhase: 0,
  phase1InPhase: 0,
  phase2InPhase: 0,
  phase3InPhase: 0,
  phase0HasNotAttempted: 0,
  progressCheckHasNotAttempted: 0,
  phase1HasNotAttempted: 0,
  phase2HasNotAttempted: 0,
  phase3HasNotAttempted: 0,
  phase0Attempt1: 0,
  progressCheckAttempt1: 0,
  phase1Attempt1: 0,
  phase2Attempt1: 0,
  phase3Attempt1: 0,
  phase0Attempt2: 0,
  progressCheckAttempt2: 0,
  phase1Attempt2: 0,
  phase2Attempt2: 0,
  phase3Attempt2: 0,
  phase0Attempt3: 0,
  progressCheckAttempt3: 0,
  phase1Attempt3: 0,
  phase2Attempt3: 0,
  phase3Attempt3: 0,
  phase0Attempt4: 0,
  progressCheckAttempt4: 0,
  phase1Attempt4: 0,
  phase2Attempt4: 0,
  phase3Attempt4: 0,
  phase0Attempt5: 0,
  progressCheckAttempt5: 0,
  phase1Attempt5: 0,
  phase2Attempt5: 0,
  phase3Attempt5: 0
}



exports.hasNotAdvanced = (learner, phase) => {
  if (phase === 5) {
    learner.phase === 'Phase 5' ? true : false
  } else if (phase === 4) {
    learner.phase === 'Phase 4' ? true : false
  } else {
    if (learner[`phase_${phase + 1}_interview_outcome` === 'Not Accept']) {
      return true
    } else if (learner.phase === `Phase ${phase}` && !learner[`phase_${phase + 1}_interview_outcome`]) {
      return true
    } else {
      return false
    }
  }
}

exports.graduatedEarly = (learner, phase) => {
  if (phase !== 5 && learner.exit_phase === `Phase ${phase}` && learner.exit_type) {
    if (learner.exit_type.includes('Graduate')) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

exports.didLearnerAdvance = (learner, phase) => {
  if (phase === 1 && learner.phase_2_interview_outcome === 'Accept' && learner.date_phase_2) {
    return true
  } else if ((phase === 2 || phase === 3) && learner[`phase_${phase + 1}_interview_outcome`] === 'Accept' &&
    learner[`date_phase_${phase}`] && learner[`date_phase_${phase + 1}`]) {
      return true
  } else if (phase === 4 && (learner.date_phase_4 && learner.date_phase_5)) {
    return true
  } else if (phase === 5 && (learner.date_phase_5 && learner.resignation_date)) {
    return true
  } else {
    return false
  }
}

exports.advancementNumberOfWeeks = (learner, phase) => {
  if (phase === 1) {
    if (learner.date_phase_1) {
      return Math.round(moment(learner.date_phase_2).diff(moment(learner.date_phase_1), 'days')/7)
    } else {
      return Math.round(moment(learner.date_phase_2).diff(moment(learner.enrollee_start_date), 'days')/7)
    }
  } else if (phase === 5) {
    return Math.round(moment(learner.resignation_date).diff(moment(learner.date_phase_5), 'days')/7)
  } else {
    return Math.round(moment(learner[`date_phase_${phase + 1}`]).diff(moment(learner[`date_phase_${phase}`]), 'days')/7)
  }
}

exports.assessmentNumberOfWeeks = (learner, phase) => {
  let weeks = moment().utc().diff(moment(learner[`date_phase_${phase}`]).subtract(7, 'days'), 'weeks')
  if (weeks <= 8) {
    if (weeks <= 0) {
      return '1'
    } else {
      return weeks.toString()
    }
  } else {
    return '8+'
  }
}

exports.numberOfTries = (learner, phase) => {
  if (learner[`phase_${phase + 1}_attempt`] === 'First') {
    return 1
  } else if (learner[`phase_${phase + 1}_attempt`] === 'Second') {
    return 2
  } else if (learner[learner[`phase_${phase + 1}_attempt`] === 'Third']) {
    return 3
  } else if (learner[`phase_${phase + 1}_attempt`] === 'Fourth') {
    return 4
  } else if (learner[`phase_${phase + 1}_attempt`] === 'Fifth') {
    return 5
  } else {
    return 0
  }
}
