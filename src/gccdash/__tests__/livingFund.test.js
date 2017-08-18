import test from 'tape'

import {
  LIVING_FUND_ISA_MAX_PERCENTAGE,
  LIVING_FUND_TOTAL_STIPEND_AMOUNT,
  isaLivingFundISAPercentage,
  isaLivingFundPaymentCap,
} from '../livingFund'

test('isacalc/livingFund', t => {
  t.test('isaLivingFundISAPercentage', tt => {
    tt.test('throws if the given stipend amount is not a number', ttt => {
      ttt.plan(1)
      ttt.throws(() => isaLivingFundISAPercentage('xyz'))
    })

    tt.test('returns LIVING_FUND_ISA_MAX_PERCENTAGE if the stipend received >= LIVING_FUND_TOTAL_STIPEND_AMOUNT', ttt => {
      ttt.plan(1)
      const isaPct = isaLivingFundISAPercentage(LIVING_FUND_TOTAL_STIPEND_AMOUNT)
      ttt.equal(isaPct, LIVING_FUND_ISA_MAX_PERCENTAGE, 'should be LIVING_FUND_ISA_MAX_PERCENTAGE')
    })

    tt.test('returns pro-rated amount of LIVING_FUND_ISA_MAX_PERCENTAGE the stipend received < LIVING_FUND_TOTAL_STIPEND_AMOUNT', ttt => {
      ttt.plan(1)
      const stipendReceived = 12922.80
      const isaPct = isaLivingFundISAPercentage(stipendReceived)
      const expectedPct = (stipendReceived / LIVING_FUND_TOTAL_STIPEND_AMOUNT) * LIVING_FUND_ISA_MAX_PERCENTAGE
      ttt.equal(isaPct, expectedPct, 'should be pro-rated amount of LIVING_FUND_ISA_MAX_PERCENTAGE')
    })
  })

  t.test('isaLivingFundPaymentCap', tt => {
    tt.test('throws if the given stipend amount is not a number', ttt => {
      ttt.plan(1)
      ttt.throws(() => isaLivingFundPaymentCap('xyz'))
    })

    tt.test('returns 2x the stipend received', ttt => {
      ttt.plan(1)
      const stipendReceived = 12922.80
      const paymentCap = isaLivingFundPaymentCap(stipendReceived)
      ttt.equal(paymentCap, 2 * stipendReceived, 'should be 2x the stipend received')
    })
  })
})
