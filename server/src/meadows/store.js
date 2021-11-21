import { ConditionsStore } from '../snow/store.js'
import { SkiBowlParser } from './parser.js'

class SkiBowlStore extends ConditionsStore {
  constructor(props) {
    super({
      ...props,
      headers: {
        'User-Agent': 'PostmanRuntime/7.21.0',
        Host: 'skibowl.com',
      },
      parserFactory: (...props) => new SkiBowlParser(...props),
    })
  }
  async getCondition() {
    return super.getCurrentConditions()
  }
}

const exported = {
  SkiBowlStore,
}

export default exported
export { SkiBowlStore }
