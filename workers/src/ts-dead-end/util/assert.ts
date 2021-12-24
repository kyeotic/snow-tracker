export function assert(predicate: unknown, message: string): asserts predicate is true {
  if (!predicate) throw new Error(message)
}
