export interface Logger {
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

const logger: Logger = {
  info: (...args: unknown[]): void => console.log(...args),
  warn: (...args: unknown[]): void => console.warn(...args),
  error: (...args: unknown[]): void => console.error(...args),
  debug: (...args: unknown[]): void => console.debug(...args),
}

export default logger
export { logger }

export function wrapper(maybe: Logger | undefined): Logger {
  return maybe || logger
}
