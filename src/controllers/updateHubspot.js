'use strict'
require('dotenv').config()
const fs = require('fs')
const XLSX = require('xlsx')
const moment = require('moment')
const axios = require('axios')

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY
const url = `https://api.hubapi.com/contacts/v1/contact/batch/?hapikey=${HUBSPOT_API_KEY}`

const postData = data => {
  return axios.post(url, data)
    .then(response => {
      console.log('post successful')
      return response
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

export const formatDataForHubspot = (data, type) => {
  const emails = Object.keys(data)
  const hubspotData = []
  emails.forEach(email => {
    if (type === 'clear') {
      hubspotData.push({email, properties: data[email].properties})
    } else {
      const isaDataValue = JSON.stringify(data[email].isa_data)
      data[email].properties.push({property: 'isa_data', value: isaDataValue})
      hubspotData.push({email, properties: data[email].properties})
    }
  })
  return hubspotData
}

export const clearHubspotData = (data, email) => {
  const clearedData = Object.assign({}, data)
  clearedData[email] = {
    properties: [
      {property: 'has_pif', value: ''},
      {property: 'pif_amount_eligible', value: ''},
      {property: 'pif_amount_accepted', value: ''},
      {property: 'pif_amount_received', value: ''},
      {property: 'pif_payment_count', value: ''},
      {property: 'pif_income_percent', value: ''},
      {property: 'pif_date_signed', value: ''},
      {property: 'pif_status', value: ''},
      {property: 'has_llf', value: ''},
      {property: 'llf_amount_eligible', value: ''},
      {property: 'llf_amount_accepted', value: ''},
      {property: 'llf_amount_received', value: ''},
      {property: 'llf_payment_count', value: ''},
      {property: 'llf_income_percent', value: ''},
      {property: 'llf_date_signed', value: ''},
      {property: 'llf_status', value: ''},
      {property: 'isa_data', value: ''},
      {property: 'isa_payments_past_due', value: ''},
      {property: 'isa_deferment_type', value: ''},
      {property: 'isa_income_docs_received', value: ''}
    ]
  }
  return clearedData
}

export const readWorkbook = (filepath, callback) => {
  const workbook = XLSX.readFile(filepath)
  const sheet = XLSX.utils.sheet_to_json(workbook.Sheets.Output)
  const data = {}
  let clearData = {}
  sheet.forEach(row => {
    const email = row.Email
    clearData = clearHubspotData(clearData, email)
    if (!data[email]) {
      data[email] = {
        properties: [],
        llfCount: 0,
        pifCount: 0,
        isa_data: [],
        collectionStatus: false,
        totalPaymentsReceived: false,
        isaDefermentType: false,
        isaIncomeDocsReceived: false
      }
    }
    data[email].isa_data.push(row)

    if (row['Current Status of Learner'] !== 'Cancelled' &&
        row['Current Status of Learner'] !== "Cancelled/Written Off" &&
        row['Internal Status'] !== '3 Day Notice Sent' && 
        row['Internal Status'] !== '3 Day Notice Timeout'
        ) {
      const type = row.Program.includes('Pay') ? 'pif' : 'llf'

      if ((data[email].llfCount === 0 && type === 'llf') || (data[email].pifCount === 0 && type === 'pif')) {
        data[email].properties = data[email].properties.concat([
          {property: `has_${type}`, value: 'TRUE'},
          {property: `${type}_amount_eligible`, value: row['Amount Eligible']},
          {property: `${type}_amount_accepted`, value: row['Amount Accepted']},
          {property: `${type}_amount_received`, value: row['Confirmed Disbursements']},
          {property: `${type}_payment_count`, value: row['Payments Completed']},
          {property: `${type}_income_percent`, value: row['Income Share']},
          {property: `${type}_date_signed`, value: moment.utc(row.Signed, 'MM-DD-YYYY').valueOf()},
          {property: `${type}_status`, value: row['Current Status of Learner'].trim()},
          {property: `${type}_monthly_payment_amount`, value: row['Monthly Payment Amount']}
        ])

        if (row['First Payment Due']) {
          data[email].properties.push({property: `${type}_first_payment_due_date`, value: moment.utc(row['First Payment Due'], 'MM-DD-YYYY').valueOf()})
        }

        if (row['Total Payments Received'] && !data[email].totalPaymentsReceived) {
          data[email].properties.push({property: 'total_payments_received', value: row['Total Payments Received']})
          data[email].totalPaymentsReceived = true
        }

        if (row['Deferment Type'] && !data[email].isaDefermentType) {
          data[email].properties.push({property: 'isa_deferment_type', value: row['Deferment Type']})
          data[email].isaDefermentType = true
        }

        if (row['Collection Status'].trim() === 'PAST DUE' && !data[email].collectionStatus) {
          data[email].properties.push({property: 'isa_payments_past_due', value: 'TRUE'})
          data[email].collectionStatus = true
        }

        if (row['Income Documents Received'].trim() === 'Reported' && !data[email].isaIncomeDocsReceived) {
          data[email].properties.push({property: 'isa_income_docs_received', value: 'TRUE'})
          data[email].isaIncomeDocsReceived = true
        }
        
        if (row['Learners Monthly Salary'] && row['Income Documents Received'].trim() === 'Reported') {
          let value = row['Learners Monthly Salary'].replace(/[^0-9\.]+/g,"") * 12
          data[email].properties.push({property: 'learner_s_starting_salary', value: value})
        }

        if (type === 'llf') {
          data[email].llfCount = 1
        } else if (type === 'pif') {
          data[email].pifCount = 1
        }
      } else {
        data[email].properties.forEach(prop => {
          if (prop.property === `${type}_amount_eligible`) {
            prop.value = parseInt(prop.value, 10) + parseInt(row['Amount Eligible'], 10)
          } else if (prop.property === `${type}_amount_accepted`) {
            prop.value = parseInt(prop.value, 10) + parseInt(row['Amount Accepted'], 10)
          } else if (prop.property === `${type}_amount_received`) {
            prop.value = parseInt(prop.value, 10) + parseInt(row['Confirmed Disbursements'], 10)
          } else if (prop.property === `${type}_income_percent`) {
            prop.value = parseInt(prop.value, 10) + parseInt(row['Income Share'], 10)
          }
        })
      }
    }
  })
  const formattedClearData = formatDataForHubspot(clearData, 'clear')
  const formattedNewData = formatDataForHubspot(data, 'new')

  Promise.all([
    postData(formattedClearData),
    postData(formattedNewData)
  ])
  .then(values => {
    callback(null, values)
  })
  .catch(err => {
    console.log('promise all error')
    callback(err)
  })

  fs.unlink(filepath, err => {
    if (err) {
      console.log(err)
    }
    console.log(`sucessfully deleted ${filepath}`)
  })
}
