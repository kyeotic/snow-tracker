import { DateTime } from 'luxon'

const timeZone = 'America/Los_Angeles'

export function formatDateFull(date) {
  if (!date) return 'Unavailable'
  return DateTime.fromISO(date).toLocaleString({
    weekday: 'long',
    month: 'short',
    day: '2-digit',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  })
}

export function formatShortDay(date) {
  if (!date) return 'Unavailable'
  return DateTime.fromISO(date).toLocaleString({ month: '2-digit', day: '2-digit', timeZone })
}
