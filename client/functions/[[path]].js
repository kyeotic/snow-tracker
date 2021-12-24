import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages'

// @ts-ignore
import * as build from '../build'

const handleRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    return {
      snow: context.env.snow,
    }
  },
})

export function onRequest(context) {
  return handleRequest(context)
}
