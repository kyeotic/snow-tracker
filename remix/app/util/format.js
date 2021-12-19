import { DateTime } from 'luxon'

export function formatDateFull(date) {
  if (!date) return 'Unavailable'
  return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_FULL)
}
