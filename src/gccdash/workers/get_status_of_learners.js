require('dotenv').config();
const querystring = require('querystring');
const axios = require('axios');
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const urlStart = 'https://api.hubapi.com/contacts/v1/lists/';
const urlEnd = `/contacts/all?hapikey=${HUBSPOT_API_KEY}&count=100&`;
const lists = require('./utils/report').lists;
const properties = require('./utils/report').properties;
const knex = require('../../db');
const moment = require('moment-timezone');
let queryString = querystring.stringify({property: properties});

//pull the data for each list from HubSpot API
let index = 0;
setInterval(() => {
  if (index < lists.length) {
    let list = lists[index];
    let listID = Object.keys(list)[0];
    let fullUrl = `${urlStart}${listID}${urlEnd}${queryString}`;
    let hasMore = true;

  //need to account for list pagination
  // while (hasMore) {
  // }
    axios.get(fullUrl)
    .then(res => {
      let contacts = res.data.contacts;
      if (contacts.length > 0) {
        contacts.forEach( contact => {
          let record = Object.assign({}, list[listID]);

          if (listID === 2592 && contact.properties['resignation_date'].value < contact.properties['cancellation_date'].value) {
            record.metaStage = 'Program Start';
            record.rollupStage = 'Program Start prior to Commitment';
            record.stage = 'Program Start prior to Commitment';
          }

          record['hubspot_canonical_vid'] = contact['canonical-vid'];

          properties.forEach( property => {
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
                    property === 'llf_first_payment_due_date'
                ) {
                  let date = moment(parseInt(contact.properties[property].value));
                  let offset = moment.tz.zone('America/New_York').offset(date);
                  record[property] = date.add(offset, 'minutes');
                } else {
                  record[property] = contact.properties[property].value;
                }
              }
            }   
          });   
          knex.insert(record).into('status_of_learners').catch(err => {
            console.log(err);
            console.log('record', record);
          });
        });
      }
      // console.log(res.data.contacts[0].properties);
    })
    // .then(() => console.log(res.data.contacts))
    .catch(err => console.log(err)
  );
    index++;
  } else {
    return;
  }
}, 250);
