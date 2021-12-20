// in seconds
export const oneDay = 86400
export const oneMinute = 60
export const fiveMinutes = oneMinute * 5
export const oneHour = 3600

export interface CacheControlOptions {
  maxAge?: number

  /** stale-while-revalidate*/
  swr?: number
}
export function cacheControl({ maxAge = fiveMinutes, swr = oneHour }: CacheControlOptions = {}): {
  'Cache-Control': string
} {
  return { 'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${swr}` }
}

export function headers(...fields: Record<string, string>[]) {
  return Object.fromEntries(fields.map((f) => Object.entries(f)).flat())
}
