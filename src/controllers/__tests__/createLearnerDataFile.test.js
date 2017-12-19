import test from 'tape'
import {
  formatLearnerData,
  formatFunnelData,
  formatRetentionData
} from '../createLearnerDataFile'

const learners = [
  {
    email: 'learner@email.com',
    dob_mm_dd_yyyy_: null,
    createdate: '2016-05-06T07:00:00.000Z',
    enrollee_start_date: '2017-08-01T07:00:00.000Z',
    cancellation_date: null,
    llf_amount_eligible: '23000.25',
    llf_amount_accepted: null,
    llf_amount_received: '85',
    llf_payment_count: null,
    llf_income_percent: '0.085',
    learner_s_starting_salary: '85000.5'
  }
]

test('controllers/createLearnerDataFile', t => {
  t.test('formatLearnerData', tt => {
    tt.test('should format the dates and numbers for each learner', ttt => {
      ttt.plan(3)
      const formattedData = formatLearnerData(learners)
      ttt.equal(formattedData[0].llf_amount_eligible, 23000.25, 'should be 23000.25')
      ttt.equal(formattedData[0].createdate, '2016-05-06', 'should be 2016-05-06')
      ttt.equal(formattedData[0].cancellation_date, null, 'should be null')
    })
  })
})

// [ anonymous {
//   stage: '1st ISA Payment-5th ISA Payment',
//   stageStatus: 'Curently In',
//   count: '3' },
// anonymous {
//   stage: 'Contract Signed, pre-Program Start',
//   stageStatus: 'Out During Stage',
//   count: '60' },
// anonymous {
//   stage: 'Graduation to Job Start',
//   stageStatus: 'Curently In',
//   count: '17' },
// anonymous {
//   stage: 'Job Accepted, prior to first ISA Payment',
//   stageStatus: 'Curently In',
//   count: '15' },
// anonymous {
//   stage: 'Phase 2 Start-End',
//   stageStatus: 'Curently In',
//   count: '5' },
// anonymous {
//   stage: 'Phase 2 Start-End',
//   stageStatus: 'Out During Stage',
//   count: '50' },
// anonymous {
//   stage: 'Phase 3 Start-End',
//   stageStatus: 'Curently In',
//   count: '28' },
// anonymous {
//   stage: 'Phase 3 Start-End',
//   stageStatus: 'Out During Stage',
//   count: '5' },
// anonymous {
//   stage: 'Phase 4 Start-End',
//   stageStatus: 'Curently In',
//   count: '18' } ]


