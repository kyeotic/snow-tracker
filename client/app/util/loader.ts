// in seconds
const oneMinute = 60
const oneHour = oneMinute * 60
export const defaultCacheTime = oneMinute * 2
export const defaultSwrTime = oneHour

export interface CacheControlOptions {
  maxAge?: number

  /** stale-while-revalidate*/
  swr?: number
}
export function cacheControl({
  maxAge = defaultCacheTime,
  swr = oneHour,
}: CacheControlOptions = {}): {
  'Cache-Control': string
} {
  return { 'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${swr}` }
}

export function headers(...fields: Record<string, string>[]) {
  return Object.fromEntries(fields.map((f) => Object.entries(f)).flat())
}
