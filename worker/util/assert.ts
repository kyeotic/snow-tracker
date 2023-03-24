export function assert(predicate: any, message: string): asserts predicate {
  if (!predicate) throw new Error(message)
}
