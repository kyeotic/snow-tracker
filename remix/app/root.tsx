import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from 'remix'
import type { MetaFunction } from 'remix'

export const meta: MetaFunction = () => {
  return { title: 'Snow Tracker' }
}

export function links() {
  return [
    { rel: 'stylesheet', href: '/css/reset.css' },
    { rel: 'stylesheet', href: '/css/weather-icons/css/weather-icons.min.css' },
    { rel: 'apple-touch-icon', href: '/images/snow_cal_v2.png' },
  ]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <Meta />
        <Links />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
        function updateSite(event) {
          window.location.reload(true);
      }
      window.applicationCache.addEventListener('updateready', updateSite, false);`,
          }}
        ></script>
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}
