import { DateTime } from 'luxon'

export function formatDateFull(date) {
  if (!date) return 'Unavailable'
  return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_FULL)
}

export function formatShortDay(date) {
  if (!date) return 'Unavailable'
  return DateTime.fromISO(date).toLocaleString({ month: '2-digit', day: '2-digit' })
}
