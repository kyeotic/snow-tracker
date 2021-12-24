/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare-pages/globals" />
/// <reference types="@cloudflare/workers-types" />

export {}

declare global {
  const snow: KVNamespace
}
