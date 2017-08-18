import {
  isaSessionStartDate,
  momentDayOnly,
  numDaysInISASession,
  openDaysBetween,
} from '@learnersguild/guild-dates'

export const ISA_NUM_SESSIONS = 5
export const ISA_PAYMENT_TERM_NUM_MONTHS = 36

// --- program
export const PROGRAM_COST = 29750
export const PROGRAM_REBATE_AMOUNT = 4250
export const PROGRAM_ISA_MAX_PERCENTAGE = 0.125 // 12.5 %
export const SESSION_COST = PROGRAM_COST / ISA_NUM_SESSIONS
export const SESSION_ISA_MAX_PERCENTAGE = PROGRAM_ISA_MAX_PERCENTAGE / ISA_NUM_SESSIONS
export const SESSION_COMPLETION_THRESHOLD_PERCENTAGE = 0.6 // 60%

export const _isaSessionCompletionPercentage = (startDate, exitDate, sessionIndex) => {
  const sessionStart = momentDayOnly(isaSessionStartDate(startDate, sessionIndex))
  const exit = momentDayOnly(exitDate)
  const numSessionDays = numDaysInISASession(startDate, sessionIndex)
  const completedDays = openDaysBetween(sessionStart, exit)
  const numCompletedDays = Math.min(completedDays.length, numSessionDays)
  return numCompletedDays / numSessionDays
}

export const isaSessionISAPercentage = (startDate, exitDate, sessionIndex) => {
  const completionPct = _isaSessionCompletionPercentage(startDate, exitDate, sessionIndex)
  if (completionPct >= SESSION_COMPLETION_THRESHOLD_PERCENTAGE) {
    return SESSION_ISA_MAX_PERCENTAGE
  }
  return completionPct * SESSION_ISA_MAX_PERCENTAGE
}

const _isaSessionsISAPercentages = (startDate, exitDate) => {
  return Array.from(Array(ISA_NUM_SESSIONS).keys())
    .map(sessionIndex => isaSessionISAPercentage(startDate, exitDate, sessionIndex))
}

const _isaSessionsCompletionPercentages = (startDate, exitDate) => {
  return Array.from(Array(ISA_NUM_SESSIONS).keys())
    .map(sessionIndex => _isaSessionCompletionPercentage(startDate, exitDate, sessionIndex))
}

export const isaProgramISAPercentage = (startDate, exitDate) => {
  return _isaSessionsISAPercentages(startDate, exitDate)
    .reduce((sum, sessionPct) => sum + sessionPct, 0)
}

export const isaProgramFundingAmount = (startDate, exitDate) => {
  return _isaSessionsCompletionPercentages(startDate, exitDate)
    .map(sessionPct => {
      if (sessionPct >= SESSION_COMPLETION_THRESHOLD_PERCENTAGE) {
        return SESSION_COST
      }
      return sessionPct * SESSION_COST
    })
    .reduce((sum, sessionCost) => sum + sessionCost, 0)
}

export const isaProgramPaymentCap = (startDate, exitDate) => (2 * isaProgramFundingAmount(startDate, exitDate))

export const isaProgramRebateAmount = (startDate, exitDate) => {
  const finalSessionIndex = ISA_NUM_SESSIONS - 1
  const completionPct = _isaSessionCompletionPercentage(startDate, exitDate, finalSessionIndex)
  if (completionPct >= SESSION_COMPLETION_THRESHOLD_PERCENTAGE) {
    return PROGRAM_REBATE_AMOUNT
  }
  return 0
}
