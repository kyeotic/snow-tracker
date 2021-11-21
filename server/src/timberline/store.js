import { ConditionsStore } from '../snow/store.js'
import { TimberlineParser } from './parser.js'

export class TimberlineStore extends ConditionsStore {
  constructor(props) {
    super({
      ...props,
      parserFactory: (...props) => new TimberlineParser(...props)
    })
  }
}
