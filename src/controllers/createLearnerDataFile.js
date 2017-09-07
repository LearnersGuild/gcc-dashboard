'use strict';
require('dotenv').config();
const XLSX = require('xlsx');
const moment = require('moment');
const fs = require('fs');
const knex = require('../db');

// knex.select().from('status_of_learners').limit(10)
// .then(rows => console.log(rows[0].email))
// .catch(err => console.log(err));
// let wb = { SheetNames: [], Sheets: {}};
// var ws_name = 'SheetJS';
 
// /* make worksheet */
var ws_data = [
    [ 'S', 'h', 'e', 'e', 't', 'J', 'S' ],
    [ 1, 2, 3, 4, 5 ],
    [1, 2, 3, 4, 5, 6, 7]
];
// var ws = XLSX.utils.aoa_to_sheet(ws_data);
 
// /* Add the sheet name to the list */
// wb.SheetNames.push(ws_name);
 
// /* Load the worksheet object */
// wb.Sheets[ws_name] = ws;

// console.log(wb.SheetNames);
// let sheet = XLSX.utils.sheet_to_json(wb.Sheets[ws_name]);
// console.log(sheet[1]);

export const file = cb => {
  cb(ws_data);
};

// {
//     id: 10,
//     hubspot_canonical_vid: 6787301,
//     email: 'mateo.balcorta@gmail.com',
//     firstname: 'Mateo',
//     lastname: 'Balcorta',
//     dob_mm_dd_yyyy_: null,
//     gender: 'Other',
//     race_ethnicity: 'Latino or Hispanic American',
//     highest_degree_earned: 'Undergraduate',
//     income_level: '$75K - $100K',
//     current_employment_status: 'Unemployed',
//     createdate: 2016-08-24T07:00:00.000Z,
//     enrollee_start_date: 2017-08-07T07:00:00.000Z,
//     cancellation_date: 2017-09-10T07:00:00.000Z,
//     phase: 'Phase 1',
//     resignation_date: null,
//     exit_type: null,
//     exit_phase: null,
//     ps_inactive_type: null,
//     stageStatus: 'Curently In',
//     metaStage: 'Program Start',
//     rollupStage: 'Program Start prior to Commitment',
//     stage: 'Program Start prior to Commitment',
//     has_llf: true,
//     llf_amount_eligible: '29750.00',
//     llf_amount_accepted: '29750.00',
//     llf_amount_received: '0.00',
//     llf_payment_count: '0.00',
//     llf_income_percent: '0.1250',
//     llf_date_signed: 2017-08-11T07:00:00.000Z,
//     llf_amount_paid: null,
//     llf_first_payment_due_date: null,
//     llf_status: 'School',
//     has_pif: null,
//     pif_amount_eligible: null,
//     pif_amount_accepted: null,
//     pif_amount_received: null,
//     pif_payment_count: null,
//     pif_income_percent: null,
//     pif_date_signed: null,
//     pif_amount_paid: null,
//     pif_first_payment_due_date: null,
//     pif_status: null,
//     learner_s_starting_salary: null,
//     have_you_accepted_a_job_offer: null,
//     has_received_llf_financing: null,
//     isa_data: null,
//     created_at: 2017-09-06T08:00:28.647Z,
//     updated_at: 2017-09-06T08:00:28.647Z }



