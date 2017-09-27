import test from 'tape'
import {
  formatContacts
} from '../getStatusOfLearners'
import {
  properties, lists
} from '../utils/report'

// test('workers/getStatusOfLearners', t => {
//   t.test('formatContacts', tt => {
//     tt.test('should rereturn an array of records', ttt => {
//       ttt.plan(1)

//       ttt.equal(clearData['email@test.com'].properties[0].property, 'has_pif', 'should be has_pif')
//     })

//     tt.test('should return a new object with the addition of each email', ttt => {
//       ttt.plan(3)
//       const oneEmail = clearHubspotData({}, 'email@test.com')
//       const twoEmail = clearHubspotData(oneEmail, 'email2@test.com')

//       ttt.equal(twoEmail.hasOwnProperty('email@test.com'), true, 'should be true')
//       ttt.equal(twoEmail.hasOwnProperty('email2@test.com'), true, 'should be true')
//       ttt.equal(oneEmail.hasOwnProperty('email2@test.com'), false, 'should be false')
//     })
//   })
// })
