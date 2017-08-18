import test from 'tape'

import {
  expectedExitDate,
  momentDayOnly,
  throwsIfInvalidDates,
} from '@learnersguild/guild-dates'

import {
  PROGRAM_COST,
  PROGRAM_ISA_MAX_PERCENTAGE,
  PROGRAM_REBATE_AMOUNT,
  SESSION_COST,
  SESSION_ISA_MAX_PERCENTAGE,
  isaSessionISAPercentage,
  isaProgramISAPercentage,
  isaProgramFundingAmount,
  isaProgramPaymentCap,
  isaProgramRebateAmount,
} from '../program'

test('isacalc/program', t => {
  t.test('isaSessionISAPercentage', tt => {
    tt.test('throws if the given dates are not dates', throwsIfInvalidDates(isaSessionISAPercentage))

    tt.test('returns SESSION_ISA_MAX_PERCENTAGE if session > 60% completed', ttt => {
      ttt.plan(1)
      const sessionPct = isaSessionISAPercentage(momentDayOnly('2016-11-28'), momentDayOnly('2017-07-07'), 2)
      ttt.equal(sessionPct, SESSION_ISA_MAX_PERCENTAGE, 'should be SESSION_ISA_MAX_PERCENTAGE')
    })

    tt.test('returns pro-rated amount of SESSION_ISA_MAX_PERCENTAGE if session < 60% completed', ttt => {
      ttt.plan(1)
      const sessionPct = isaSessionISAPercentage(momentDayOnly('2016-11-28'), momentDayOnly('2017-04-27'), 2)
      const expectedPct = (23 / 39) * SESSION_ISA_MAX_PERCENTAGE
      ttt.equal(sessionPct, expectedPct, 'should be pro-rated amount of SESSION_ISA_MAX_PERCENTAGE')
    })
  })

  t.test('isaProgramISAPercentage', tt => {
    tt.test('throws if the given dates are not dates', throwsIfInvalidDates(isaProgramISAPercentage))

    tt.test('returns PROGRAM_ISA_MAX_PERCENTAGE if stayed for close-to full program', ttt => {
      ttt.plan(1)
      const startDate = momentDayOnly('2016-11-28')
      const exitDate = momentDayOnly(expectedExitDate(startDate)).subtract(2, 'weeks').toDate()
      const programPct = isaProgramISAPercentage(startDate, exitDate)
      ttt.equal(programPct, PROGRAM_ISA_MAX_PERCENTAGE, 'should be PROGRAM_ISA_MAX_PERCENTAGE')
    })

    tt.test('returns < PROGRAM_ISA_MAX_PERCENTAGE if left early', ttt => {
      ttt.plan(1)
      const startDate = momentDayOnly('2016-11-28')
      const exitDate = momentDayOnly('2017-06-19')
      const programPct = isaProgramISAPercentage(startDate, exitDate)
      const expectedPct = (3 * SESSION_ISA_MAX_PERCENTAGE) + (15 / 37 * SESSION_ISA_MAX_PERCENTAGE)
      ttt.equal(programPct, expectedPct, 'should be 3 sessions plus ([completed days in 4th session] / [num days in 4th session] * 100)% of a 4th')
    })
  })

  t.test('isaProgramFundingAmount', tt => {
    tt.test('throws if the given dates are not dates', throwsIfInvalidDates(isaProgramFundingAmount))

    tt.test('returns PROGRAM_COST if stayed for close-to full program', ttt => {
      ttt.plan(1)
      const startDate = momentDayOnly('2016-11-28')
      const exitDate = momentDayOnly(expectedExitDate(startDate)).subtract(2, 'weeks').toDate()
      const fundingAmount = isaProgramFundingAmount(startDate, exitDate)
      ttt.equal(fundingAmount, PROGRAM_COST, 'should be PROGRAM_COST')
    })

    tt.test('returns < PROGRAM_COST if left early', ttt => {
      ttt.plan(1)
      const startDate = momentDayOnly('2016-11-28')
      const exitDate = momentDayOnly('2017-06-19')
      const fundingAmount = isaProgramFundingAmount(startDate, exitDate)
      const expectedAmount = SESSION_COST * 3 + (15 / 37 * SESSION_COST)
      ttt.equal(fundingAmount, expectedAmount, 'should be cost of 3 sessions plus ([completed days in 4th session] / [num days in 4th session] * 100)% cost of a 4th')
    })
  })

  t.test('isaProgramPaymentCap', tt => {
    tt.test('throws if the given dates are not dates', throwsIfInvalidDates(isaProgramPaymentCap))

    tt.test('returns 2x the funding amount', ttt => {
      ttt.plan(1)
      const startDate = momentDayOnly('2016-11-28')
      const exitDate = momentDayOnly(expectedExitDate(startDate)).subtract(2, 'weeks').toDate()
      const fundingAmount = isaProgramFundingAmount(startDate, exitDate)
      const paymentCap = isaProgramPaymentCap(startDate, exitDate)
      ttt.equal(paymentCap, 2 * fundingAmount, 'should be 2x the funding amount')
    })
  })

  t.test('isaProgramRebateAmount', tt => {
    tt.test('throws if the given dates are not dates', throwsIfInvalidDates(isaProgramRebateAmount))

    tt.test('returns PROGRAM_REBATE_AMOUNT if stayed for close-to full program', ttt => {
      ttt.plan(1)
      const startDate = momentDayOnly('2016-11-28')
      const exitDate = momentDayOnly(expectedExitDate(startDate)).subtract(2, 'weeks').toDate()
      const rebate = isaProgramRebateAmount(startDate, exitDate)
      ttt.equal(rebate, PROGRAM_REBATE_AMOUNT, 'should be PROGRAM_REBATE_AMOUNT')
    })

    tt.test('returns 0 if stayed < 4.6 full sessions', ttt => {
      ttt.plan(1)
      const startDate = momentDayOnly('2016-11-28')
      const exitDate = momentDayOnly(expectedExitDate(startDate)).subtract(5, 'weeks').toDate()
      const rebate = isaProgramRebateAmount(startDate, exitDate)
      ttt.equal(rebate, 0)
    })
  })
})
