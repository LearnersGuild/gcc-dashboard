'use strict'
require('dotenv').config()
const moment = require('moment-timezone')
const knex = require('../db')
const _ = require('lodash')

const fields = [
  'firstname',
  'lastname',
  'enrollee_start_date',
  'resignation_date',
  'learner_s_starting_salary',
  'learner_reported_salary',
  'llf_status',
  'pif_status',
  'llf_payment_count',
  'pif_payment_count',
  'llf_income_percent',
  'pif_income_percent',
  'isa_payments_past_due',
  'isa_income_docs_received',
  'isa_deferment_type',
  'pif_monthly_payment_amount',
  'llf_monthly_payment_amount',
  'llf_first_payment_due_date',
  'pif_first_payment_due_date'
]

const getISAData = () => {
  let today = moment.tz('America/Los_Angeles').format('YYYY-MM-DD')
  return knex.select(...fields).from('status_of_learners')
    .whereRaw('created_at >= ? AND resignation_date < ? AND ((has_llf = ? AND llf_status != ? AND llf_status != ?) OR (has_pif = ? AND pif_status != ? AND pif_status != ?))' ,
    [today, today, 'true', 'Written Off\/Cancelled', 'Cancelled', 'true', 'Written Off\/Cancelled', 'Cancelled'])
    .orderBy('enrollee_start_date', 'asc')
    .then(rows => {
      return rows
    })
    .catch(err => console.log(err))
}

const formatSummaryData = (data) => {
  const segments = []
  let segmentData = {
          segment: '',
          exitedLearners: 0,
          inSchoolOrPending: 0,
          inGrace: 0,
          inTransition: 0,
          inPayment: 0,
          inDeferment: 0,
          incomeDocsReceived: 0,
          haveMadePayments: 0,
          pastDue: 0,
          currentOnPayments: 0,
        }
  const total = Object.assign({}, segmentData)
  total.segment = 'Total'
  segments.push(total)
  let currentSegment
  data.forEach((learner, index) => {
    let segment = moment(learner.enrollee_start_date).format('YYYY-MM')
    if (index === 0) {
      currentSegment = Object.assign({}, segmentData)
      currentSegment.segment = segment
    }
    if (currentSegment.segment !== segment) {
      segments.push(currentSegment)
      currentSegment = Object.assign({}, segmentData)
      currentSegment.segment = segment
    }
    
    total.exitedLearners++
    currentSegment.exitedLearners++
    if (learner.pif_status === 'School' || learner.llf_status === 'School') {
      console.log(learner)
    }
    if (learner.pif_status === 'School' ||
      learner.pif_status === 'Pending ISA Adjustment Form' ||
      learner.llf_status === 'School' ||
      learner.llf_status === 'Pending ISA Adjustment Form') {
        total.inSchoolOrPending++
        currentSegment.inSchoolOrPending++
    } else if (learner.pif_status === 'Grace' || learner.llf_status === 'Grace') {
      total.inGrace++
      currentSegment.inGrace++
    } else if (learner.pif_status === 'Payment' || learner.llf_status === 'Payment') {
      if (learner.first_payment_due_date > moment().subtract(7, 'days').toDate()) {
        total.inTransition++
        currentSegment.inTransition++
      } else {
        total.inPayment++
        currentSegment.inPayment++
      }
      if (learner.total_payment_count > 0 && learner.isa_payments_past_due === 'Past Due') {
        total.pastDueButHaveMadePayments++
        currentSegment.pastDueButHaveMadePayments++
      }
      if (learner.payment_status === 'Past Due') {
        total.pastDue++
        currentSegment.pastDue++
      } else if (learner.payment_status === 'Current') {
        total.currentOnPayments++
        currentSegment.currentOnPayments++
      }
    } else if (learner.pif_status === 'Deferment' || learner.llf_status === 'Deferment') {
      total.inDeferment++
      currentSegment.inDeferment++
    }
    
    if (learner.isa_income_docs_received === 'Yes') {
      total.incomeDocsReceived++
      currentSegment.incomeDocsReceived++
    }

    if (learner.total_payment_count > 0) {
      total.haveMadePayments++
      currentSegment.haveMadePayments++
    }

    if (index === data.length - 1) {
      segments.push(currentSegment)
    }
  })
  return segments
}

const formatLearnerData = learnerData => {
  return learnerData.map(rawLearner => {
    let learner = Object.assign({}, rawLearner)
    learner.enrollee_start_date = moment(learner.enrollee_start_date).format('YYYY-MM-DD')
    learner.resignation_date = moment(learner.resignation_date).format('YYYY-MM-DD')

    if (parseFloat(learner.learner_s_starting_salary) > 0) {
      learner.learner_s_starting_salary = learner.learner_s_starting_salary
    } else if (parseFloat(learner.learner_reported_salary) > 0) {
      learner.learner_s_starting_salary = `${learner.learner_reported_salary}*`
    } else {
      learner.learner_s_starting_salary = 0
    }
    learner.pif_income_percent = parseFloat(learner.pif_income_percent * 100).toFixed(1)
    learner.llf_income_percent = parseFloat(learner.llf_income_percent * 100).toFixed(1)
    learner.isa_income_docs_received = learner.isa_income_docs_received ? 'Yes' : 'No'
    learner.pif_monthly_payment_amount = parseFloat(learner.pif_monthly_payment_amount) > 0 ? learner.pif_monthly_payment_amount : 0
    learner.llf_monthly_payment_amount = parseFloat(learner.llf_monthly_payment_amount) > 0 ? learner.llf_monthly_payment_amount : 0
    if (parseInt(learner.pif_payment_count, 10) > 0 && parseInt(learner.llf_payment_count, 10) > 0) {
      learner.total_payment_count = learner.pif_payment_count
    } else if (parseInt(learner.pif_payment_count, 10) > 0) {
      learner.total_payment_count = learner.pif_payment_count
    } else if (parseInt(learner.llf_payment_count, 10) > 0) {
      learner.total_payment_count = learner.llf_payment_count
    } else {
      learner.total_payment_count = 0
    }
    if (learner.pif_first_payment_due_date) {
      learner.first_payment_due_date = learner.pif_first_payment_due_date
    } else {
      learner.first_payment_due_date = learner.llf_first_payment_due_date
    }
    if (learner.pif_status === 'Grace' || learner.llf_status === 'Grace') {
        learner.payment_status = 'Grace'
    } else if (learner.pif_status === 'School' ||
        learner.pif_status === 'Pending ISA Adjustment Form' ||
        learner.llf_status === 'School' ||
        learner.llf_status === 'Pending ISA Adjustment Form') {
        learner.payment_status = 'School/Pending ISA Adjustment'
    } else if ((learner.pif_status === 'Payment' || learner.llf_status === 'Payment') &&
      learner.first_payment_due_date > moment().subtract(7, 'days')) {
        learner.payment_status = 'Transition'
    } else if ((learner.pif_status === 'Payment' || learner.llf_status === 'Payment') &&
      learner.first_payment_due_date < moment().subtract(7, 'days')) {
        learner.payment_status = learner.isa_payments_past_due ? 'Past Due' : 'Current'
    } else if (learner.pif_status === 'Deferment' || learner.llf_status === 'Deferment') {
        learner.payment_status = learner.isa_deferment_type
    }
    return learner
  })
}

export const report =  async (cb) => {
  try {
    const reportData = {}
    const rawLearnerData = await getISAData()
    const learnerData = formatLearnerData(rawLearnerData)
    reportData.summary = formatSummaryData(learnerData)
    reportData.exitedWithActiveISA = learnerData
    reportData.schoolAndPending = _.filter(learnerData, o => { 
      if (o.payment_status === 'School/Pending ISA Adjustment') {
        return o
      }
    })
    reportData.grace = _.filter(learnerData, o => {
      if (o.payment_status === 'Grace') {
        return o
      }
    })
    reportData.transition = _.filter(learnerData, o => {
      if (o.payment_status === 'Transition') {
        return o
      }
    })
    reportData.payment = _.filter(learnerData, o => {
      if (o.payment_status === 'Current' || o.payment_status === 'Past Due') {
        return o
      }
    })
    reportData.deferment = _.filter(learnerData, o => {
      if (o.pif_status === 'Deferment' || o.llf_status === 'Deferment') {
        return o
      }
    })
    reportData.noIncomeDocsReceived = _.filter(learnerData, o => { return o.isa_income_docs_received === 'No' })
    reportData.haveMadePayments = _.filter(learnerData, o => { return o.total_payment_count > 0 })
    reportData.pastDue = _.filter(learnerData, o => { return o.payment_status === 'Past Due' })
    cb(null, reportData)
  } catch(err) {
    console.log(err)
    cb(err)
  }
}
