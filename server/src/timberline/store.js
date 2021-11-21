import { ConditionsStore } from '../snow/store.js'
import { TimberlineParser } from './parser.js'

class TimberlineStore extends ConditionsStore {
  constructor(props) {
    super({
      ...props,
      parserFactory: (...props) => new TimberlineParser(...props),
    })
  }
}

const exported = {
  TimberlineStore,
}

export default exported
export { TimberlineStore }
