export function tryParseFloat(val) {
  const num = parseFloat(val)
  return Number.isNaN(num) ? 0 : num
}
