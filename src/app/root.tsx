import type { MetaFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import styles from './index.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Snow Tracker',
  viewport: 'width=device-width,initial-scale=1',
})

export function links() {
  return [
    { rel: 'stylesheet', href: '/css/reset.css' },
    { rel: 'stylesheet', href: '/css/weather-icons/css/weather-icons.min.css' },
    { rel: 'stylesheet', href: styles },
    { rel: 'apple-touch-icon', href: '/images/snow_cal_v2.png' },
    { rel: 'manifest', href: '/manifest.json' },
  ]
}

export default function Root() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <meta name="theme-color" content="#000000" />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
