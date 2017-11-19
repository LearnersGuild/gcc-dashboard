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
  'llf_monthly_payment_amount'
]

// const getISAData = async () => {
//  //where resignation_date < today
//  //and has_llf OR has_pif
 
// }

const getISAData = () => {
  let today = moment.tz('America/Los_Angeles').format('YYYY-MM-DD')
  return knex.select(...fields).from('status_of_learners')
    .whereRaw('created_at >= ? AND resignation_date < ? AND ((has_llf = ? AND llf_status != ?) OR (has_pif = ? AND pif_status != ?))' ,
    [today, today, 'true', 'Written Off\/Cancelled', 'true', 'Written Off\/Cancelled'])
    .orderBy('enrollee_start_date', 'asc')
    .then(rows => {
      return rows
    })
    .catch(err => console.log(err))
}
getISAData()

const getSegment = (learner, type) => {
  if (type === 'byCohort') {
      return moment(learner.enrollee_start_date).format('MMM-YY')
  }
  if (type === 'Total') {
    return 'Total'
  }
}

const formatData = (data, type) => {
  const segments = []
  let segmentData = {
          segment: '',
          inJobSearch: 0,
          inJobPartTime: 0,
          inJobFullTime: 0,
          inPaymentPartTime: 0,
          inPaymentFullTime: 0,
          inDefermentPartTime: 0,
          inDefermentFullTime: 0,
          currentOnPaymentsPartTime: 0,
          currentOnPaymentsFullTime: 0,
          noPaymentsMadePartTime: 0,
          noPaymentsMadeFullTime: 0,
          pastDueButHaveMadePaymentsPartTime: 0,
          pastDueButHaveMadePaymentsFullTime: 0
        }
  let salaryPartTime = []
  let salaryFullTime = []
  let reportedSalaryPartTime = []
  let reportedSalaryFullTime = []
  let pifPercentPartTime = []
  let pifPercentFullTime = []
  let llfPercentPartTime = []
  let llfPercentFullTime = []

  data.forEach((learner, index) => {
    let segment = getSegment(learner, type)
    if (index === 0) {
      segmentData.segment = segment
    }
    if (segmentData.segment !== segment) {
      segmentData.avgSalaryFullTime = isNaN(_.round(_.mean(salaryFullTime))) ? 0 : _.round(_.mean(salaryFullTime))
      segmentData.avgSalaryPartTime = isNaN(_.round(_.mean(salaryPartTime))) ? 0 : _.round(_.mean(salaryPartTime))
      segmentData.avgReportedSalaryFullTime = isNaN(_.round(_.mean(reportedSalaryFullTime))) ? 0 : _.round(_.mean(reportedSalaryFullTime))
      segmentData.avgReportedSalaryPartTime = isNaN(_.round(_.mean(reportedSalaryPartTime))) ? 0 : _.round(_.mean(reportedSalaryPartTime))
      segmentData.avgPIFPercentFullTime = isNaN(_.mean(pifPercentFullTime).toFixed(4)) ? 0 : _.mean(pifPercentFullTime).toFixed(4)
      segmentData.avgPIFPercentPartTime = isNaN(_.mean(pifPercentPartTime).toFixed(4)) ? 0 : _.mean(pifPercentPartTime).toFixed(4)
      segmentData.avgLLFPercentFullTime = isNaN(_.mean(llfPercentFullTime).toFixed(4)) ? 0 : _.mean(llfPercentPartTime).toFixed(4)
      segmentData.avgLLFPercentPartTime = isNaN(_.mean(llfPercentFullTime).toFixed(4)) ? 0 : _.mean(llfPercentPartTime).toFixed(4)
      segments.push(segmentData)
      segmentData = {
        segment: segment,
        inJobSearch: 0,
        inJobPartTime: 0,
        inJobFullTime: 0,
        inPaymentPartTime: 0,
        inPaymentFullTime: 0,
        inDefermentPartTime: 0,
        inDefermentFullTime: 0,
        currentOnPaymentsPartTime: 0,
        currentOnPaymentsFullTime: 0,
        noPaymentsMadePartTime: 0,
        noPaymentsMadeFullTime: 0,
        pastDueButHaveMadePaymentsPartTime: 0,
        pastDueButHaveMadePaymentsFullTime: 0
      }
      salaryPartTime = []
      salaryFullTime = []
      reportedSalaryPartTime = []
      reportedSalaryFullTime = []
      pifPercentPartTime = []
      pifPercentFullTime = []
      llfPercentPartTime = []
      llfPercentFullTime = []
    }

    if (learner.employed_in_or_out_of_field !== 'Employed In Field' || !learner.employment_type) {
      segmentData.inJobSearch++
    } else {
      let status = learner.employment_type === 'Full Time Position' ? 'FullTime' : 'PartTime'
      segmentData[`inJob${status}`]++

      if ((learner.pif_status === 'Payment' || learner.llf_status === 'Payment')) {
        segmentData[`inPayment${status}`]++
        if (!learner.isa_payments_past_due) {
          segmentData[`currentOnPayments${status}`]++
        }
        if (learner.isa_payments_past_due) {
          if (
            parseInt(learner.pif_payment_count, 10)  ||
            parseInt(learner.llf_payment_count, 10)
          ) {
            segmentData[`pastDueButHaveMadePayments${status}`]++
          } else {
            segmentData[`noPaymentsMade${status}`]++
          }
        }
      }
      if ((learner.pif_status === 'Deferment' || learner.llf_status === 'Deferment')) {
        segmentData[`inDeferment${status}`]++
      }
      if (learner.learner_s_starting_salary) {
        status === 'FullTime' ? salaryFullTime.push(parseFloat(learner.learner_s_starting_salary)) : salaryPartTime.push(parseFloat(learner.learner_s_starting_salary))
      }
      if (learner.learner_reported_salary) {
        status === 'FullTime' ? reportedSalaryFullTime.push(parseFloat(learner.learner_reported_salary)) : reportedSalaryPartTime.push(parseFloat(learner.learner_reported_salary))
      }
      if (learner.pif_income_percent) {
        status === 'FullTime' ? pifPercentFullTime.push(parseFloat(learner.pif_income_percent)) : pifPercentPartTime.push(parseFloat(learner.pif_income_percent))
      }
      if (learner.llf_income_percent) {
        status === 'FullTime' ? llfPercentFullTime.push(parseFloat(learner.llf_income_percent)) : llfPercentPartTime.push(parseFloat(learner.llf_income_percent))
      }
    }
    
    if (index === data.length - 1) {
      segmentData.avgSalaryFullTime = salaryFullTime.length > 0 ? _.round(_.mean(salaryFullTime)) : 0
      segmentData.avgSalaryPartTime = salaryPartTime.length > 0 ? _.round(_.mean(salaryPartTime)) : 0
      segmentData.avgReportedSalaryFullTime = reportedSalaryFullTime.length > 0 ? _.round(_.mean(reportedSalaryFullTime)) : 0
      segmentData.avgReportedSalaryPartTime = reportedSalaryPartTime.length > 0 ? _.round(_.mean(reportedSalaryPartTime)) : 0
      segmentData.avgPIFPercentFullTime = pifPercentFullTime.length > 0 ? _.mean(pifPercentFullTime).toFixed(4) : 0
      segmentData.avgPIFPercentPartTime = pifPercentPartTime.length > 0 ? _.mean(pifPercentPartTime).toFixed(4) : 0
      segmentData.avgLLFPercentFullTime = llfPercentFullTime.length > 0 ? _.mean(llfPercentFullTime).toFixed(4) : 0
      segmentData.avgLLFPercentPartTime = llfPercentPartTime.length > 0 ? _.mean(llfPercentPartTime).toFixed(4) : 0
      segments.push(segmentData)
    }
  })
  if (type === 'byIncome') {
    return orderIncomeSegments(segments)
  }
  return segments
}

const report =  async (dates, cb) => {
  try {
    const reportData = {}
    const learnerData = await getISAData()
    reportData.exitedWithActiveISA = learnerData
    reportData.schoolAndPending = _.filter(learnerData, o => { 
      if (o.pif_status === 'School' ||
        o.pif_status === 'Pending ISA Adjustment' ||
        o.llf_status === 'School' ||
        o.llf_status === 'Pending ISA Adjustment') {
        return o
      }
    })
    reportData.grace = _.filter(learnerData, o => {
      if (o.pif_status === 'Grace' || o.llf_status === 'Grace') {
        return o
      }
    })
    reportData.payment = _.filter(learnerData, o => {
      if (o.pif_status === 'Payment' || o.llf_status === 'Payment') {
        return o
      }
    })
    reportData.deferment = _.filter(learnerData, o => {
      if (o.pif_status === 'Deferment' || o.llf_status === 'Deferment') {
        return o
      }
    })
    reportData.noIncomeDocsReceived = _.filter(learnerData, o => { return !o.isa_income_docs_received })
    reportData.incomeDocsReceived = _.filter(learnerData, o => { return o.isa_income_docs_received }) 
    reportData.hasMadePayments = _.filter(learnerData, o => { 
      if (o.llf_payment_count > 0 || o.pif_payment_count > 0) {
        return o
      }
    })
    reportData.pastDue = _.filter(learnerData, o => { return o.isa_payments_past_due })
    cb(null, reportData)
  } catch(err) {
    console.log(err)
    cb(err)
  }
}

report()
