require('dotenv').config();
const querystring = require('querystring');
const axios = require('axios');
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const urlStart = 'https://api.hubapi.com/contacts/v1/lists/';
const urlEnd = `/contacts/all?hapikey=${HUBSPOT_API_KEY}&count=100&`;
import {lists, properties} from './utils/report';


let queryString = querystring.stringify({property: properties});

//pull the data for each list from HubSpot API
lists.forEach( list => {
  let listID = Object.keys(list)[0];

  axios.get(`${urlStart}${listID}${urlEnd}${queryString}`)
    .then(res => {
      let contacts = res.data.contacts;
      if (contacts.length) {
        contacts.forEach( contact => {
          //knex insert
          let record = Object.assign(list[listID]);
          //TODO convert Hubspot timestaps to UTC -- use Moment module
          // // get the current time so we know which offset to take (DST is such bullkitten)
          // var now = moment.utc();
          // // get the zone offsets for this time, in minutes
          // var NewYork_tz_offset = moment.tz.zone("America/New_York").offset(now); 
          // var HongKong_tz_offset = moment.tz.zone("Asia/Hong_Kong").offset(now);
          // // calculate the difference in hours
          // console.log((NewYork_tz_offset - HongKong_tz_offset) / 60);


          //need to account for list pagination
          
          properties.forEach( property => {
            record[property] = contact.properties[property].value;
          });
          
          knex('status_of_learners').insert(record);
        });
      }
      console.log(res.data.contacts[0].properties);
    })
    // .then(() => console.log(res.data.contacts))
    .catch(err => console.log(err)
  );
});
