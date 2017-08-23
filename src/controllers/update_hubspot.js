'use strict';
require('dotenv').config();
const XLSX = require('xlsx');
const moment = require('moment');
const axios = require('axios');
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const url = `https://api.hubapi.com/contacts/v1/contact/batch/?hapikey=${HUBSPOT_API_KEY}`;

const postToHubspot = (data) => {
  axios.post(url, data)
    .then(response => console.log('postToHubspot response', Object.keys(response)))
    .catch(error => { 
      error.response.data.failureMessages.forEach(message => console.log(message.propertyValidationResult));
    });
};

const formatDataForHubspot = (data) => {
  let emails = Object.keys(data);
  let hubspotData = [];
  emails.forEach(email => {
    hubspotData.push(
      {email: email, properties: data[email].properties}
    );
  });
  postToHubspot(hubspotData);
};



export const readWorkbook = (filepath) => {
  let workbook = XLSX.readFile(filepath);
  let sheet = XLSX.utils.sheet_to_json(workbook.Sheets['Summary']);
  let data = {};
  
  sheet.forEach(row => {
    if (row['Current Status of Learner'] !== 'Cancelled') {
      let email = row['Email'];
      let type = '';
      if (!data[email]) {
        data[email] = {'properties': [], llfCount: 0};
      }
      
      row['Program'].includes('Pay It Forward') ? type = 'pif' : type = 'llf';

      if (data[email].llfCount === 0 || type === 'pif') {
        data[email].properties = data[email].properties.concat([
          {property: `has_${type}`, value: 'TRUE' },
          {property: `${type}_amount_eligible`, value: row['Amount Eligible'] },
          {property: `${type}_amount_accepted`, value: row['Amount Accepted']},
          {property: `${type}_amount_received`, value: row['Amount of Stipend Received']},
          {property: `${type}_payment_count`, value: row['Payments Completed']},
          {property: `${type}_income_percent`, value: row['Income Share'] },
          {property: `${type}_date_signed`, value: moment.utc(row['Date of Signed ISA'], 'MM-DD-YYYY').valueOf()},
          {property: `${type}_status`, value: row['Current Status of Learner']}
        ]);
        if (Date.parse(row[`${type}_first_payment_due_date`])) {
          data[email].properties.push({property: `${type}_first_payment_due_date`, value: moment.utc(row['First Payment Due'], 'MM-DD-YYYY').valueOf()});
        }
        if (type === 'llf') {
          data[email].llfCount = 1;
        }
      } else {
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
  formatDataForHubspot(data);

};
