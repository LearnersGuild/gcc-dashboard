'use strict';
require('dotenv').config()
const XLSX = require('xlsx')
const moment = require('moment');
const axios = require('axios');
const fs = require('fs');
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const url = `https://api.hubapi.com/contacts/v1/contact/batch/?hapikey=${HUBSPOT_API_KEY}`;

const postClearData = (clearData) => {
  return axios.post(url, clearData)
    .then((response) => {
      console.log('cleardata success')
      return response
    })
    .catch(error => {
      console.error('error in post', error)
      error.response.data.failureMessages.forEach(message => console.log('clearData error', message.propertyValidationResult));
      return error
    })
}  

const postNewData = (newData) => {
  return axios.post(url, newData)
    .then(response => { 
      console.log('postNewData success')
      return response 
    })
    .catch(error => { 
      console.log('postNewData error')
      error.response.data.failureMessages.forEach(message => console.log('newData error', message.propertyValidationResult));
      return Promise.reject(error)
    });
}
const formatDataForHubspot = (data, type) => {
  let emails = Object.keys(data);
  let hubspotData = [];
  emails.forEach(email => {
    if (type === 'clear') {
      hubspotData.push({email: email, properties: data[email].properties});
    } else {
      let isaDataValue = JSON.stringify(data[email]['isa_data']);
      data[email].properties.push({property: 'isa_data', value: isaDataValue});
      hubspotData.push({email: email, properties: data[email].properties});
    }
  });
  return hubspotData;
};

let clearData = {};

const clearHubspotData = (email) => {
  clearData[email] = {
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
    ]
  };
};

export const readWorkbook = (filepath, callback) => {
  let workbook = XLSX.readFile(filepath);
  let sheet = XLSX.utils.sheet_to_json(workbook.Sheets['Output'])
  let data = {}
  let rows = 0;
  sheet.forEach(row => {
    rows++;
    let email = row['Email'];
    clearHubspotData(email);
    
    if (!data[email]) {
      data[email] = {properties: [], llfCount: 0, 'isa_data': []};
    }
    data[email]['isa_data'].push(row);

    if (row['Current Status of Learner'] === 'Grace' || 
        row['Current Status of Learner'] === 'Payment' ||
        row['Current Status of Learner'] === 'Deferment' ||
        row['Current Status of Learner'] === 'School' ||
        row['Current Status of Learner'] === 'Pending ISA Adjustment' || 
        row['Current Status of Learner'] === 'Pending School'
        ) {

      let type = row['Program'].includes('Pay') ? 'pif' : 'llf';

      if ((data[email].llfCount === 0 && type ==='llf') || (type === 'pif' && row['Internal Status'] !== '3 Day Notice Sent' && row['Internal Status'] !== '3 Day Notice Timeout' )) {
        data[email].properties = data[email].properties.concat([
          {property: `has_${type}`, value: 'TRUE' },
          {property: `${type}_amount_eligible`, value: row['Amount Eligible'] },
          {property: `${type}_amount_accepted`, value: row['Amount Accepted']},
          {property: `${type}_amount_received`, value: row['Amount of Stipend Received']},
          {property: `${type}_payment_count`, value: row['Payments Completed']},
          {property: `${type}_income_percent`, value: row['Income Share'] },
          {property: `${type}_date_signed`, value: moment.utc(row['Signed'], 'MM-DD-YYYY').valueOf()},
          {property: `${type}_status`, value: row['Current Status of Learner']}
        ]);
        if (Date.parse(row['First Payment Due'])) {
          data[email].properties.push({property: `${type}_first_payment_due_date`, value: moment.utc(row['First Payment Due'], 'MM-DD-YYYY').valueOf()});
        }
        if (type === 'llf') {
          data[email].llfCount = 1;
        }
      } else if (type !== 'pif') {
        data[email].properties.forEach(prop => {
          if (prop.property === 'llf_amount_eligible') {
            prop.value = parseInt(prop.value) + parseInt(row['Amount Eligible']);
          } else if (prop.property === 'llf_amount_accepted') {
            prop.value = parseInt(prop.value) + parseInt(row['Amount Accepted']);
          } else if (prop.property === 'llf_amount_received') {
            prop.value = parseInt(prop.value) + parseInt(row['Amount of Stipend Received']);
          } else if (prop.property === 'llf_income_percent') {
            prop.value = parseInt(prop.value) + parseInt(row['Income Share']);
          }
        });
      }
    }
  });
  let formattedClearData = formatDataForHubspot(clearData, 'clear');
  let formattedNewData = formatDataForHubspot(data, 'new');

  Promise.all([
   postClearData(formattedClearData),
   postNewData(formattedNewData)
  ])
  .then(values => {
    callback(null, values)
  })
  .catch(error => {
    console.log('promise all error')
    callback(error)
  })
  
  
  // save for debugging
  // formattedNewData.forEach(student => {
  //   let countPif = 0;
  //   student.properties.forEach(prop => {
  //     if (prop.property === 'pif_amount_accepted') {
  //       countPif++;
  //     }
  //     if (countPif > 1) {
  //       console.log('student', student)
  //     }
  //   })
  // })

  fs.unlink(filepath, (err) => {
    if (err) { console.log(err); }
    console.log(`sucessfully deleted ${filepath}`);
  });
};
