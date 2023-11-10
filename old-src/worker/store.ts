import { SnowStatus } from './weather/types.ts'

const kv = await Deno.openKv()
const KEYS = {
  timberline: ['snow', 'timberline'],
  skiBowl: ['snow', 'skiBowl'],
  meadows: ['snow', 'meadows'],
} as const

export class SnowStore {
  private kv: Deno.Kv

  constructor() {
    this.kv = kv
  }

  async get(key: keyof typeof KEYS): Promise<SnowStatus | null> {
    const val = await this.kv.get(KEYS[key])
    return val.value
  }

  async put(key: keyof typeof KEYS, status: SnowStatus): Promise<void> {
    await this.kv.set(KEYS[key], status)
  }
}
