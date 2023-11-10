import { type LinksFunction, type MetaFunction } from '@remix-run/deno'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { asset, css } from '../assets.ts'

const appStyles = asset('/app.css', css)

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Snow Tracker',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: '/css/reset.css' },
    { rel: 'stylesheet', href: '/css/weather-icons/css/weather-icons.min.css' },
    { rel: 'stylesheet', href: appStyles.href },
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
        <meta name="description" content="Check the status of PDX Snow Sport Conditions" />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload port={Number(window.location.port)} />
      </body>
    </html>
  )
}
