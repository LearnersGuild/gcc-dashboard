import test from 'tape'
import {
  formatContacts
} from '../getStatusOfLearners'
import {
  properties, lists
} from '../utils/report'

const contacts = [
  {'canonical-vid': '1', 
    email: 'email@test.com',
    properties: {
    'cancellation_date': {value: '1474243200000'},
    'resignation_date': {value: '1464988764846'}
    }
  },
  {'canonical-vid': '2', 
    email: 'email2@test.com',
    properties: {
    'cancellation_date': {value: '1464988764846'},
    'resignation_date': {value: '1474243200000'}
    }
  }
]

test('workers/getStatusOfLearners', t => {
  t.test('formatContacts', tt => {
    const records = formatContacts(contacts, lists[13][2592], '2592')
    tt.test('should return an array of 2 records', ttt => {
      ttt.plan(2)
      ttt.equal(Array.isArray(records), true, 'should be true')
      ttt.equal(records.length, 2, 'should be 2')
      
    })

    tt.test('should receive properties from the list object', ttt => {
      ttt.plan(1)
      ttt.equal(records[0].stageStatus, 'Out During Stage', 'should be \'Out During Stage\'')
    })
    tt.test('should assign the proper stages to each record', ttt => {
      ttt.plan(2)
      ttt.equal(records[0].stage, 'Program Start prior to Commitment', 'should be \'Program Start prior to Commitment\'')
      ttt.equal(records[1].stage, 'Crossed Commitment to End Phase 1', 'should be \'Crossed Commitment to End Phase 1\'')
      

    })
  })
})
