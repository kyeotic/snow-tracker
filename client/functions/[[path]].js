import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages'

// @ts-ignore
import * as build from '../build'

const handleRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    // does not have snow binding
    console.log('context build', context.env.snow)
    return {}
  },
})

export function onRequest(context) {
  // does not have snow binding
  console.log('context request', context.env)
  // createRequestHandler({
  //   getLoadContext() {
  //     console.log('context build', context)
  //     return {}
  //   },
  // })
  return handleRequest(context)
}
