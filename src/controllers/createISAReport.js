'use strict'
require('dotenv').config()
const moment = require('moment')
const knex = require('../db')
const _ = require('lodash')

const fields = [
  'firstname',
  'lastname',
  'enrollee_start_date',
  'resignation_date',
  'learner_s_starting_salary',
  'llf_status',
  'pif_status',
  'llf_payment_count',
  'pif_payment_count',
  'llf_income_percent',
  'pif_income_percent',
  'isa_payments_past_due'
]

const getISAData = async () => {
 //where resignation_date < today
 //and has_llf OR has_pif
 //
}
