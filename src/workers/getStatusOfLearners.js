'use strict'
require('dotenv').config()
const querystring = require('querystring')
const axios = require('axios')
const moment = require('moment-timezone')
const knex = require('../db')
const properties = require('./utils/report').properties
const lists = require('./utils/report').lists

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY
const urlStart = 'https://api.hubapi.com/contacts/v1/lists/'
const urlEnd = `/contacts/all?hapikey=${HUBSPOT_API_KEY}&count=100&`
const queryString = querystring.stringify({property: properties})

const formatContacts = (contacts, listObject, listID) => {
  return contacts.map(contact => {
    const record = Object.assign({}, listObject)
    if (listID === '2592' && contact.properties.resignation_date.value < contact.properties.cancellation_date.value) {
      record.metaStage = 'Program Start'
      record.rollupStage = 'Program Start prior to Commitment'
      record.stage = 'Program Start prior to Commitment'
    }
    record.hubspot_canonical_vid = contact['canonical-vid']
    properties.forEach(property => {
      if (contact.properties[property]) {
        if (contact.properties[property].value !== '') {
          if (property === 'dob_mm_dd_yyyy_' ||
              property === 'createdate' ||
              property === 'enrollee_start_date' ||
              property === 'cancellation_date' ||
              property === 'resignation_date' ||
              property === 'llf_date_signed' ||
              property === 'pif_date_signed' ||
              property === 'pif_first_payment_due_date' ||
              property === 'llf_first_payment_due_date' ||
              property === 'date_phase_1' ||
              property === 'date_phase_2' ||
              property === 'date_phase_3' ||
              property === 'date_phase_4' ||
              property === 'date_phase_5' ||
              property === 'job_start_date'
          ) {
            const date = moment(parseInt(contact.properties[property].value, 10))
            const offset = moment.tz.zone('America/New_York').offset(date)
            record[property] = date.add(offset, 'minutes')
          } else if (property === 'race_new') {
            record.race = contact.properties[property].value
          } else if (property === 'jobtitle') {
            record.job_title = contact.properties[property].value
          } else {
            record[property] = contact.properties[property].value
          }
        }
      }
    })
    return record
  })
}

// pull the data for each list from HubSpot API
let index = 0
let interval = null

const work = () => {
  if (index < lists.length) {
    const list = lists[index]
    const listID = Object.keys(list)[0]
    let fullUrl = `${urlStart}${listID}${urlEnd}${queryString}`

  // need to account for list pagination
      // if (vidOffset !== '') {
      //   fullUrl = fullUrl + '&vidOffset=' + vidOffset
      // }
  
      axios.get(fullUrl)
      .then(res => {
        const contacts = res.data.contacts
        // hasMore = res.data['has-more']
        // vidOffset = res.data['vid-offset']
        // if (!hasMore) {
        //   index++
        //   vidOffset = ''
        // }
        return formatContacts(contacts, list[listID], listID)
      })
      .then(records => {
        records.forEach(record => {
          knex.insert(record).into('status_of_learners').catch(err => {
            console.log(err)
            console.log('record', record)
          })
        })
      })
      .catch(err => console.log(err))
    index++
  } else {
    clearInterval(interval)
    console.log('getStatusOfLearners Worker Complete')
  }
}

if (process.env.NODE_ENV === 'production') {
  interval = setInterval(work, 250)
}

module.exports.formatContacts = formatContacts;
