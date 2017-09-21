import test from 'tape'
import { 
  clearHubspotData,
  formatDataForHubspot 
} from '../updateHubspot.js'


test('controllers/updateHubspot', t => {
  t.test('clearHubspotData', tt => {

    tt.test('should create a new object with the properties ti clear', ttt => {
      ttt.plan(1)
      const clearData = clearHubspotData({}, 'email@test.com')

      ttt.equal(clearData['email@test.com'].properties[0].property, 'has_pif', 'should be has_pif')
    })

    tt.test('should return a new object with the addition of each email', ttt => {
      ttt.plan(3)
      const oneEmail = clearHubspotData({}, 'email@test.com')
      const twoEmail = clearHubspotData(oneEmail, 'email2@test.com')

      ttt.equal(twoEmail.hasOwnProperty('email@test.com'), true, 'should be true')
      ttt.equal(twoEmail.hasOwnProperty('email2@test.com'), true, 'should be true')
      ttt.equal(oneEmail.hasOwnProperty('email2@test.com'), false, 'should be false')
    })
  })

  t.test('formatDataForHubspot', tt => {
    tt.test('should correctly format clear data', ttt => {
      ttt.plan(2)
      const clearData =  {'email@test.com': {
        properties: [
          {property: 'has_pif', value: ''},
          {property: 'pif_amount_eligible', value: ''}
        ]}
      }
      const formattedClearData = formatDataForHubspot(clearData, 'clear')
      ttt.equal(formattedClearData.length, 1, 'should be an array with length of 1')
      ttt.equal(formattedClearData[0].email, 'email@test.com' , 'should have correct email value')
    })

    tt.test('should correctly format new data', ttt => {
      ttt.plan(3)
      const newData =  {
        'email@test.com': {
          properties: [
            {property: 'has_pif', value: 'TRUE'},
            {property: 'pif_amount_eligible', value: '25000'},
          ],
          isa_data: 'some data'
        }
      }
      const formattedNewData = formatDataForHubspot(newData, 'new')
      ttt.equal(formattedNewData.length, 1, 'should be an array with length of 1')
      ttt.equal(formattedNewData[0].email, 'email@test.com' , 'should have correct email value')
      ttt.equal(formattedNewData[0].properties[formattedNewData[0].properties.length - 1].property, 'isa_data', 'should have isa_data')
    })
  })
})
