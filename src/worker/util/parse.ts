export function tryParseFloat(val: string | undefined): number {
  if (!val) return 0
  const num = parseFloat(val)
  return Number.isNaN(num) ? 0 : num
}
