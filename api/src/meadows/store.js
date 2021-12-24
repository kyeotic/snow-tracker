import { ConditionsStore } from '../snow/store.js'
import { MeadowsParser } from './parser.js'

export class MeadowsStore extends ConditionsStore {
  constructor(props) {
    super({
      ...props,
      parserFactory: (...props) => new MeadowsParser(...props)
    })
  }
}
