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
    .whereRaw('created_at >= ? AND resignation_date < ? AND ((has_llf = ? AND llf_status != ? AND ' + 
      'llf_status != ?) OR (has_pif = ? AND pif_status != ? AND pif_status != ?))',
      [today, today, 'true', 'Written Off\/Cancelled', 'Cancelled', 'true', 'Written Off\/Cancelled', 'Cancelled'])
    .orderBy('enrollee_start_date', 'asc')
    .then(rows => {
      return rows
    })
    .catch(err => console.log(err))
}

const formatDate = date => (moment(date).format('YYYY-MM-DD'))

const formatStartingSalary = learner => {
  if (parseFloat(learner.learner_s_starting_salary) > 0) {
    return learner.learner_s_starting_salary
  } else if (parseFloat(learner.learner_reported_salary) > 0) {
    return `${learner.learner_reported_salary}*`
  } else {
    return '0'
  }
}

const getTotalPaymentCount = learner => {
  if (parseInt(learner.pif_payment_count, 10) > 0 && parseInt(learner.llf_payment_count, 10) > 0) {
    return learner.pif_payment_count
  } else if (parseInt(learner.pif_payment_count, 10) > 0) {
    return learner.pif_payment_count
  } else if (parseInt(learner.llf_payment_count, 10) > 0) {
    return learner.llf_payment_count
  } else {
    return 0
  }
}

const getPaymentStatusAndValue = learner => {
  if (learner.pif_status === 'School' ||
      learner.pif_status === 'Pending ISA Adjustment Form' ||
      learner.llf_status === 'School' ||
      learner.llf_status === 'Pending ISA Adjustment Form') {
        return {status:'School/Pending ISA Adjustment', value: 'School/Pending ISA Adjustment'}
  } else if (learner.pif_status === 'Grace' || learner.llf_status === 'Grace') {
    return {status:'Grace', value: 'Grace'}
  } else if (learner.isa_deferment_type) {
    return {status: 'Deferment', value: learner.isa_deferment_type}
  } else if (learner.pif_status === 'Payment' || learner.llf_status === 'Payment') {
    if (learner.first_payment_due_date > moment().subtract(7, 'days') && !learner.isa_payments_past_due && learner.total_payment_count === 0) {
        return {status: 'Transition', value: 'Transition'}
    } else {
      return {status: 'Payment', value: learner.isa_payments_past_due ? 'Past Due' : 'Current'}
    }
  }
}

const formatLearnerData = learnerData => {
  return learnerData.map(learner => {
    learner.segment = moment(learner.enrollee_start_date).format('YYYY-MM')
    learner.enrollee_start_date = formatDate(learner.enrollee_start_date)
    learner.resignation_date = formatDate(learner.resignation_date)
    learner.learner_s_starting_salary = formatStartingSalary(learner)
    learner.pif_income_percent = parseFloat(learner.pif_income_percent * 100).toFixed(1)
    learner.llf_income_percent = parseFloat(learner.llf_income_percent * 100).toFixed(1)
    learner.isa_income_docs_received = learner.isa_income_docs_received ? 'Yes' : 'No'
    learner.pif_monthly_payment_amount = parseFloat(learner.pif_monthly_payment_amount) > 0 ? learner.pif_monthly_payment_amount : 0
    learner.llf_monthly_payment_amount = parseFloat(learner.llf_monthly_payment_amount) > 0 ? learner.llf_monthly_payment_amount : 0
    learner.total_payment_count = getTotalPaymentCount(learner)
    learner.first_payment_due_date = learner.pif_first_payment_due_date ? learner.pif_first_payment_due_date : learner.llf_first_payment_due_date
    
    let paymentStatusAndValue = getPaymentStatusAndValue(learner)
    learner.payment_status = paymentStatusAndValue.status
    learner.payment_value = paymentStatusAndValue.value
    return learner
  })
}

const formatSummaryData = (segmentKeys, learnerData) => {
  const segmentData = {
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

  const total = {...segmentData}
  total.segment = 'Total'
  
  const segments = [total]
  segmentKeys.forEach(key => {
    const currentSegment = {...segmentData}
    currentSegment.segment = key

    currentSegment.exitedLearners = _.filter(learnerData, o => { return o.segment === key }).length
    total.exitedLearners += currentSegment.exitedLearners
    currentSegment.inSchoolOrPending = _.filter(learnerData, o => { 
      return o.payment_status === 'School/Pending ISA Adjustment' && o.segment === key
    }).length
    total.inSchoolOrPending += currentSegment.inSchoolOrPending
    currentSegment.inGrace = _.filter(learnerData, o => { 
      return o.payment_status === 'Grace' && o.segment === key
    }).length
    total.inGrace += currentSegment.inGrace
    currentSegment.inTransition = _.filter(learnerData, o => { 
      return o.payment_status === 'Transition' && o.segment === key
    }).length
    total.inTransition += currentSegment.inTransition
    currentSegment.inPayment = _.filter(learnerData, o => { 
      return o.payment_status === 'Payment' && o.segment === key
    }).length
    total.inPayment += currentSegment.inPayment
    currentSegment.pastDue = _.filter(learnerData, o => { 
      return o.payment_value === 'Past Due' && o.segment === key
    }).length
    total.pastDue += currentSegment.pastDue
    currentSegment.currentOnPayments = _.filter(learnerData, o => { 
      return o.payment_value === 'Current' && o.segment === key
    }).length
    total.currentOnPayments += currentSegment.currentOnPayments
    currentSegment.inDeferment = _.filter(learnerData, o => { 
      return o.payment_status === 'Deferment' && o.segment === key
    }).length
    total.inDeferment += currentSegment.inDeferment
    currentSegment.incomeDocsReceived = _.filter(learnerData, o => { 
      return o.isa_income_docs_received === 'Yes' && o.segment === key
    }).length
    total.incomeDocsReceived += currentSegment.incomeDocsReceived
    currentSegment.haveMadePayments = _.filter(learnerData, o => { 
      return o.total_payment_count > 0 && o.segment === key
    }).length
    total.haveMadePayments += currentSegment.haveMadePayments

    segments.push(currentSegment)
  })
  return segments
}

export const report =  async (cb) => {
  try {
    const rawLearnerData = await getISAData()
    const learnerData = formatLearnerData(rawLearnerData)
    const reportData = {exitedWithActiveISA: learnerData}
    const segments = _.uniq(_.map(learnerData, 'segment'))
    reportData.summary = formatSummaryData(segments, learnerData)
    reportData.schoolAndPending = _.filter(learnerData, o => { return o.payment_status === 'School/Pending ISA Adjustment' })
    reportData.grace = _.filter(learnerData, o => { return o.payment_status === 'Grace' })
    reportData.transition = _.filter(learnerData, o => { return o.payment_status === 'Transition' })
    reportData.payment = _.filter(learnerData, o => { return o.payment_status === 'Payment' })
    reportData.deferment = _.filter(learnerData, o => { return o.payment_status === 'Deferment' })
    reportData.noIncomeDocsReceived = _.filter(learnerData, o => { return o.isa_income_docs_received === 'No' })
    reportData.haveMadePayments = _.filter(learnerData, o => { return o.total_payment_count > 0 })
    reportData.pastDue = _.filter(learnerData, o => { return o.payment_value === 'Past Due' })
    cb(null, reportData)
  } catch(err) {
    console.log(err)
    cb(err)
  }
}
