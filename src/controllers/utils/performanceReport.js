'use strict'
const moment = require('moment')
const _ = require('lodash')

exports.demoSegments = [
  'Man', 'Woman', 'Transgender or Other', 'Gender Undefined', '', 'White', 'Hispanic or Latino', 'Black or African American',
  'American Indian and Alaska Native', 'Asian', 'Arab or Arab American',
  'Native Hawaiian or Other Pacific Islander', 'Some Other Race', 'Two or More Races', 'Race Undefined'
]

exports.template = {
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
  phase4In1Try: 0,
  phase5In1Try: 0,
  totalIn1Try: 0,
  phase1MoreThan1Try: 0,
  phase2MoreThan1Try: 0,
  phase3MoreThan1Try: 0,
  phase4MoreThan1Try: 0,
  phase5MoreThan1Try: 0,
  totalMoreThan1Try: 0,
  phase1AdvancedTries: 0,
  phase2AdvancedTries: 0,
  phase3AdvancedTries: 0,
  phase4AdvancedTries: 0,
  phase5AdvancedTries: 0,
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
  phase1GraduatedEarly: 0,
  phase2GraduatedEarly: 0,
  phase3GraduatedEarly: 0,
  phase4GraduatedEarly: 0
}

exports.phases = [1, 2, 3, 4, 5]

exports.isLessThan6 = (learner, phase) => {
  if (phase === 1) {
    if (learner.date_phase_1) {
      return Math.round(moment(learner.date_phase_1).diff(moment(learner.date_phase_2), 'days')/7) < 6
    } else {
      
    }
  }
}
