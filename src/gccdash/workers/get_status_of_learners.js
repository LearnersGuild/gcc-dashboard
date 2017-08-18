require('dotenv').config();
const querystring = require('querystring');
const axios = require('axios');
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const urlStart = 'https://api.hubapi.com/contacts/v1/lists/';
const urlEnd = `/contacts/all?hapikey=${HUBSPOT_API_KEY}&`;
let lists = [
  {2501: {metaStage: 'Job Search', rollupStage: 'Graduation to Job Start', stage: 'Graduation to Job Start'}},
  {2499: {metaStage: 'Job Search', rollupStage: 'Phase 5 Start-End', stage: 'Phase 5 Start-End'}},
  {2498: {metaStage: 'Program', rollupStage: 'Commitment - Phase 4 End', stage: 'Phase 4 Start-End'}},
  {2497: {metaStage: 'Program', rollupStage: 'Commitment - Phase 4 End', stage: 'Phase 3 Start-End'}},
  {2496: {metaStage: 'Program', rollupStage: 'Commitment - Phase 4 End', stage: 'Phase 2 Start-End'}},
  {2495: {metaStage: 'Program', rollupStage: 'Commitment - Phase 4 End', stage: 'Crossed Commitment to End Phase 1'}},
  {2494: {metaStage: 'Program Start', rollupStage: 'Program Start prior to Commitment', stage: 'Program Start prior to Commitment'}},
  {2493: {metaStage: 'Application', rollupStage: 'Contract Signed, Pre-Program Start', stage: 'Contract Signed, Pre-Program Start'}}
  //Build new list for folks who have dropped out. Or, figure out how to deal with dropouts....
];

let properties = [
  'exit_phase',
  'exit_type',
  'firstname',
  'lastname',
  'email',
  'phone',
  'address',
  'enrollee_start_date',
  'resignation_date',
  'phase',
  'dob_mm_dd_yyyy_',
  'income_level',
  'race_ethnicity',
  'job_start_date',
  'cancellation_date',
  'current_employment_status',
  'highest_degree_earned',
  'gender',
  'createdate',
  'ps_inactive_type'
];

// need to get the type of ISA, its percentage and other financials.

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
          //TODO record.report_date = ....
          //TODO convert Hubspot timestaps to UTC -- use Moment module
          // // get the current time so we know which offset to take (DST is such bullkitten)
          // var now = moment.utc();
          // // get the zone offsets for this time, in minutes
          // var NewYork_tz_offset = moment.tz.zone("America/New_York").offset(now); 
          // var HongKong_tz_offset = moment.tz.zone("Asia/Hong_Kong").offset(now);
          // // calculate the difference in hours
          // console.log((NewYork_tz_offset - HongKong_tz_offset) / 60);

          //canonical-vid
          
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
