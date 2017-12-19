'use strict'
require('dotenv').config()
const moment = require('moment')
const knex = require('../db')
const utils = require('./utils/learnerDataFile')

export const formatLearnerData = rows => {
  rows.forEach(row => {
    utils.numFields.forEach(field => {
      if (row[field] === '') {
        row[field] = 0
      } else {
        row[field] = parseFloat(row[field])
      }
    })
    utils.dateFields.forEach(field => {
      if (row[field]) {
        row[field] = moment(row[field]).format('YYYY-MM-DD')
      }
    })
  })
  return rows
}

const getLearnerData = dates => {
  return knex.select(...utils.fields).from('status_of_learners')
    .where('created_at', '>=', dates.reportStart)
    .andWhere('created_at', '<', dates.reportEnd)
    .then(rows => {
      return rows
    })
    .catch(err => console.log(err))
}

export const formatFunnelData = rows => {
  const stages = {}
  rows.forEach(row => {
    if (stages[row.stage]) {
      stages[row.stage][row.stageStatus] = row.count
    } else {
      stages[row.stage] = {}
      stages[row.stage][row.stageStatus] = row.count
    }
  })
  const stageKeys = Object.keys(stages)
  const formatted = []
  stageKeys.forEach(key => {
    const currentlyIn = parseInt(stages[key]['Curently In'], 10) || 0
    const outDuringStage = parseInt(stages[key]['Out During Stage'], 10) || 0
    formatted.push({stage: key, 'Currently In': currentlyIn, 'Out During Stage': outDuringStage})
  })
  return formatted
}

const getFunnelByStage = dates => {
  return knex.select('stage', 'stageStatus').from('status_of_learners').count('stage')
      .where('created_at', '>=', dates.reportStart)
      .andWhere('created_at', '<', dates.reportEnd)
      .groupBy('stage')
      .groupBy('stageStatus')
    .then(rows => {
      return rows
    })
    .catch(err => console.log(err))
}

export const formatRetentionData = rows => {
  const stages = {}
  rows.forEach(row => {
    if (stages[`${row.stage} ${row.to_char}`]) {
      stages[`${row.stage} ${row.to_char}`][row.stageStatus] = row.count
    } else {
      stages[`${row.stage} ${row.to_char}`] = {}
      stages[`${row.stage} ${row.to_char}`][row.stageStatus] = row.count
    }
  })
  const stageKeys = Object.keys(stages)
  const formatted = []
  stageKeys.forEach(key => {
    const currentlyIn = parseInt(stages[key]['Curently In'], 10) || 0
    const outDuringStage = parseInt(stages[key]['Out During Stage'], 10) || 0
    formatted.push({stage: key, 'Currently In': currentlyIn, 'Out During Stage': outDuringStage})
  })
  return formatted
}

const getRetentionByCohort = dates => {
  return knex('status_of_learners').select(knex.raw('stage, to_char(enrollee_start_date, \'Mon-YY\'), "stageStatus", COUNT(*)'))
      .where('created_at', '>=', dates.reportStart)
      .andWhere('created_at', '<', dates.reportEnd)
      .groupByRaw('stage, "stageStatus", to_char(enrollee_start_date, \'Mon-YY\')')
    .then(rows => {
      return rows
    })
    .catch(err => console.log(err))
}

export const file = async (dates, cb) => {
  try {
    const fileData = {}
    const learnerData = await getLearnerData(dates)
    fileData.learnerData = formatLearnerData(learnerData)
    const funnelData = await getFunnelByStage(dates)
    fileData.funnelData = formatFunnelData(funnelData)
    const retentionData = await getRetentionByCohort(dates)
    fileData.retentionData = formatRetentionData(retentionData)
    cb(null, fileData)
  } catch(err) {
    console.log(err)
    cb(err)
  }
}
