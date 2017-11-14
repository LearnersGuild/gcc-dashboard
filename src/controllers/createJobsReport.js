'use strict'
require('dotenv').config()
const moment = require('moment')
const knex = require('../db')
const _ = require('lodash')

const fields = [
  'gender',
  'race',
  'income_level',
  'enrollee_start_date',
  'resignation_date',
  'llf_payment_count',
  'llf_income_percent',
  'llf_status',
  'pif_payment_count',
  'pif_income_percent',
  'pif_status',
  'learner_s_starting_salary',
  'learner_reported_salary',
  'total_payments_received',
  'isa_payments_past_due',
  'employment_type'
]

const getIncomeComparisonData = (dates) => {
  return knex.select('income_level').from('status_of_learners')
    .whereRaw('created_at >= ? AND created_at < ?', [dates.reportStart, dates.reportEnd])
    .then(preGuild => {
       return knex.select('learner_s_starting_salary').from('status_of_learners')
        .whereRaw('employed_in_or_out_of_field = ? AND employment_type = ? AND created_at >= ? AND created_at < ?' ,
          ['Employed In Field', 'Full Time Position', dates.reportStart, dates.reportEnd])
        .then(postGuild => {
          return formatIncomeComparisonData(preGuild, postGuild)
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

const formatIncomeComparisonData = (preGuildData, postGuildData) => {
  const comparisonData = {
    segments: [
      {
        segment: '<$20,000',
        preGuild: _.filter(preGuildData, o => { return o.income_level === '< $20K' }).length,
        postGuild: _.filter(postGuildData, o => { return parseFloat(o.learner_s_starting_salary) < 20000 }).length
      },
      {
        segment: '$20,000-$49,999',
        preGuild: _.filter(preGuildData, o => { return (o.income_level === '$20K - $35K' || o.income_level === '$35K - $50K') }).length,
        postGuild: _.filter(postGuildData, o => { return (parseFloat(o.learner_s_starting_salary) >= 20000 && parseFloat(o.learner_s_starting_salary) < 50000) }).length 
      },
      {
        segment: '$50,000-$74,999',
        preGuild: _.filter(preGuildData, o => { return o.income_level === '$50K - $75K' }).length,
        postGuild: _.filter(postGuildData, o => { return (parseFloat(o.learner_s_starting_salary) >= 50000 && parseFloat(o.learner_s_starting_salary) < 75000) }).length
      },
      {
        segment: '$75,000-$100,000',
        preGuild: _.filter(preGuildData, o => { return o.income_level === '$75K - $100K' }).length,
        postGuild: _.filter(postGuildData, o => { return (parseFloat(o.learner_s_starting_salary) >= 75000 && parseFloat(o.learner_s_starting_salary) <= 100000) }).length
      },
      {
        segment: '>$100,000',
        preGuild: _.filter(preGuildData, o => { return (o.income_level === '$100K - $150K' || o.income_level === '$150K - $200K' || o.income_level === '> $200K') }).length,
        postGuild: _.filter(postGuildData, o => { return parseFloat(o.learner_s_starting_salary) > 100000 }).length
      }
    ]
  }
  comparisonData.preGuildTotal = _.reduce(comparisonData.segments, (sum, o) => { return sum + o.preGuild }, 0)
  comparisonData.postGuildTotal = _.reduce(comparisonData.segments, (sum, o) => { return sum + o.postGuild }, 0)
  return comparisonData
}
const getPostGuildIncomeData = () => {
  return knex.select('learner_s_starting_salary', 'employment_type').from('status_of_learners')
    .whereRaw('employed_in_or_out_of_field = ? AND created_at >= ? AND learner_s_starting_salary > ?' ,
    ['Employed In Field', moment().subtract(8, 'hours').format('YYYY-MM-DD'), 0])
    .orderBy('learner_s_starting_salary', 'asc')
    .then(rows => {
      return formatPostGuildIncomeData(rows)
    })
    .catch(err => console.log(err))
}

const formatPostGuildIncomeData = (data) => {
  const fullTime = _.filter(data, o => {return o.employment_type === 'Full Time Position'})
  const partTime = _.filter(data, o => {return o.employment_type === 'Part Time Position'})
  console.log('fullTime', fullTime)
  console.log('partTime', partTime)
  const tableData = {
    counts: [
      {
        segment: '<$20,000',
        fullTimeCount: _.filter(fullTime, o => { return parseFloat(o.learner_s_starting_salary) < 20000 }).length,
        partTimeCount: _.filter(partTime, o => { return parseFloat(o.learner_s_starting_salary) < 20000 }).length
      },
      {
        segment: '$20,000-$49,999',
        fullTimeCount: _.filter(fullTime, o => { return (parseFloat(o.learner_s_starting_salary) >= 20000 && parseFloat(o.learner_s_starting_salary) < 50000) }).length,
        partTimeCount: _.filter(partTime, o => { return (parseFloat(o.learner_s_starting_salary) >= 20000 && parseFloat(o.learner_s_starting_salary) < 50000) }).length
      },
      {
        segment: '$50,000-$74,999',
        fullTimeCount: _.filter(fullTime, o => { return (parseFloat(o.learner_s_starting_salary) >= 50000 && parseFloat(o.learner_s_starting_salary) < 75000) }).length,
        partTimeCount: _.filter(partTime, o => { return (parseFloat(o.learner_s_starting_salary) >= 50000 && parseFloat(o.learner_s_starting_salary) < 75000) }).length
      },
      {
        segment: '$75,000-$100,000',
        fullTimeCount: _.filter(fullTime, o => { return (parseFloat(o.learner_s_starting_salary) >= 75000 && parseFloat(o.learner_s_starting_salary) <= 100000) }).length,
        partTimeCount: _.filter(partTime, o => { return (parseFloat(o.learner_s_starting_salary) >= 75000 && parseFloat(o.learner_s_starting_salary) <= 100000) }).length
      },
      {
        segment: '>$100,000',
        fullTimeCount: _.filter(fullTime, o => { return parseFloat(o.learner_s_starting_salary) > 100000 }).length,
        partTimeCount: _.filter(partTime, o => { return parseFloat(o.learner_s_starting_salary) > 100000 }).length
      }
    ],
    averages: [
      {
        segment: 'Mean Salary',
        fullTimeValue: _.meanBy(fullTime, (o) => { return parseFloat(o.learner_s_starting_salary)}).toFixed(2),
        partTimeValue: _.meanBy(partTime, (o) => { return parseFloat(o.learner_s_starting_salary)}).toFixed(2)
      },
      {
        segment: 'Median Salary',
        fullTimeValue: fullTime[Math.floor(fullTime.length / 2)].learner_s_starting_salary,
        partTimeValue: partTime[Math.floor(partTime.length / 2)].learner_s_starting_salary
      },
      {
        segment: 'Max Salary',
        fullTimeValue: _.last(fullTime).learner_s_starting_salary,
        partTimeValue: _.last(partTime).learner_s_starting_salary
      },
      {
        segment: 'Min Salary',
        fullTimeValue: fullTime[0].learner_s_starting_salary,
        partTimeValue: partTime[0].learner_s_starting_salary
      }
    ],
    total: data.length,
    fullTimeTotal: fullTime.length,
    partTimeTotal: partTime.length 
  }
  return tableData
}
const getJobData = (dates, order, type) => {
  let weeks = knex.raw('resignation_date::DATE - enrollee_start_date::DATE').wrap('(', ')/7::INT AS weeks')
  return knex.select(...fields, weeks).from('status_of_learners')
    .whereRaw('employed_in_or_out_of_field = ? AND created_at >= ? AND created_at < ?' ,
    ['Employed In Field', dates.reportStart, dates.reportEnd])
    .orderBy(order, 'asc')
    .then(rows => {
      return formatData(rows, type)
    })
    .catch(err => console.log(err))
}

const getSegment = (learner, type) => {
  if (type === 'byCohort') {
      return moment(learner.enrollee_start_date).format('MMM-YY')
  }
  if (type === 'byGender') {
    if (learner.gender) {
      return learner.gender
    } else {
      return 'Undefined'
    }
  }
  if (type === 'byRace') {
    if (!learner.race) {
      return 'Undefined'
    } else {
      return learner.race
    }
  }
  if (type === 'byIncome') {
    if (learner.income_level) {
      return learner.income_level
    } else {
      return 'Undefined'
    }
  }
  if (type === 'byWeeksInProgram') {
    if (learner.weeks < 20 ) {
      return '< 20'
    } else if (learner.weeks < 30) {
      return '20 - 29'
    } else if (learner.weeks < 40) {
      return '30 - 39'
    } else if (learner.weeks === 40) {
      return '40'
    } else {
      return '> 40'
    }
  }
  if (type === 'Total') {
    return 'Total'
  }
}

const orderIncomeSegments = segArr => {
  let byIncomeSegments = []
    segArr.forEach(seg => {
      if (seg.segment === '< $20K') {
        byIncomeSegments[0] = seg
      } else if (seg.segment === '$20K - $35K') {
        byIncomeSegments[1] = seg
      } else if (seg.segment === '$35K - $50K') {
        byIncomeSegments[2] = seg
      } else if (seg.segment === '$50K - $75K') {
        byIncomeSegments[3] = seg
      } else if (seg.segment === '$75K - $100K') {
        byIncomeSegments[4] = seg
      } else if (seg.segment === '$100K - $150K') {
        byIncomeSegments[5] = seg
      } else if (seg.segment === '$150K - $200K') {
        byIncomeSegments[6] = seg
      } else if (seg.segment === '> $200K') {
        byIncomeSegments[7] = seg
      } else {
        byIncomeSegments[8] = seg
      }
    })
    return byIncomeSegments.filter(Boolean)
}

const formatData = (data, type) => {
  const segments = []
  let segmentData = {
          segment: '',
          inJob: 0,
          inPayment: 0,
          inDeferment: 0,
          currentOnPayments: 0,
          noPaymentsMade: 0,
          pastDueButHaveMadePayments: 0
        }
  let salary = []
  let reportedSalary = []
  let pifPercent = []
  let llfPercent = []

  data.forEach((learner, index) => {
    let segment = getSegment(learner, type)

    if (index === 0) {
      segmentData.segment = segment
    }
    if (segmentData.segment !== segment) {
      segmentData.avgSalary = isNaN(_.round(_.mean(salary))) ? 0 : _.round(_.mean(salary))
      segmentData.avgReportedSalary = isNaN(_.round(_.mean(reportedSalary))) ? 0 : _.round(_.mean(reportedSalary))
      segmentData.avgPIFPercent = isNaN(_.mean(pifPercent).toFixed(4)) ? 0 : _.mean(pifPercent).toFixed(4)
      segmentData.avgLLFPercent = isNaN(_.mean(llfPercent).toFixed(4)) ? 0 : _.mean(llfPercent).toFixed(4)
      segments.push(segmentData)
      segmentData = {
        segment: segment,
        inJob: 0,
        inPayment: 0,
        inDeferment: 0,
        currentOnPayments: 0,
        noPaymentsMade: 0,
        pastDueButHaveMadePayments: 0
      }
      salary = []
      reportedSalary = []
      pifPercent = []
      llfPercent = []
    }
    segmentData.inJob++

    if ((learner.pif_status === 'Payment' || learner.llf_status === 'Payment')) {
      segmentData.inPayment++
      if (!learner.isa_payments_past_due) {
        segmentData.currentOnPayments++
      }
      if (learner.isa_payments_past_due) {
        if (
          parseInt(learner.pif_payment_count, 10)  ||
          parseInt(learner.llf_payment_count, 10)
        ) {
          segmentData.pastDueButHaveMadePayments++
        } else {
          segmentData.noPaymentsMade++
        }
      }
    }
    if ((learner.pif_status === 'Deferment' || learner.llf_stats === 'Deferment')) {
      segmentData.inDeferment++
    }
    if (learner.learner_s_starting_salary) {
      salary.push(parseFloat(learner.learner_s_starting_salary))
    }
    if (learner.learner_reported_salary) {
      reportedSalary.push(parseFloat(learner.learner_reported_salary))
    }
    if (learner.pif_income_percent) {
      pifPercent.push(parseFloat(learner.pif_income_percent))
    }
    if (learner.llf_income_percent) {
      llfPercent.push(parseFloat(learner.llf_income_percent))
    }
    if (index === data.length - 1) {
      segmentData.avgSalary = salary.length > 0 ? _.round(_.mean(salary)) : 0
      segmentData.avgReportedSalary = reportedSalary.length > 0 ? _.round(_.mean(reportedSalary)) : 0
      segmentData.avgPIFPercent = pifPercent.length > 0 ? _.mean(pifPercent).toFixed(4) : 0
      segmentData.avgLLFPercent = llfPercent.length > 0 ? _.mean(llfPercent).toFixed(4) : 0
      segments.push(segmentData)
    }
  })
  if (type === 'byIncome') {
    return orderIncomeSegments(segments)
  }
  return segments
}

export const report =  async (dates, cb) => {
  const reportData = {}
  // reportData.byCohort         = await getJobData(dates, 'enrollee_start_date', 'byCohort')
  // reportData.byGender         = await getJobData(dates, 'gender', 'byGender')
  // reportData.byRace           = await getJobData(dates, 'race', 'byRace')
  // reportData.byIncome         = await getJobData(dates, 'income_level', 'byIncome' )
  // reportData.byWeeksInProgram = await getJobData(dates, 'weeks', 'byWeeksInProgram')
  // reportData.total            = await getJobData(dates, 'enrollee_start_date', 'Total')
  reportData.postGuildIncome  = await getPostGuildIncomeData()
  // reportData.incomeComparison = await getIncomeComparisonData(dates)
  cb(reportData)
}
