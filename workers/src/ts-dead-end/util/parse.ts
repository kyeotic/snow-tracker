export function tryParseFloat(val: unknown): number {
  const num = parseFloat(val as string)
  return Number.isNaN(num) ? 0 : num
}
