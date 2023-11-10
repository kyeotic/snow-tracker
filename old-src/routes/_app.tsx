import { AppProps } from '$fresh/server.ts'
import { asset } from '$fresh/runtime.ts'

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charset='utf-8' />
        <meta name='theme-color' content='#000000' />
        <meta name='description' content='Check the status of PDX Snow Sport Conditions' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='stylesheet' href={asset('/css/reset.css')} />
        <link rel='stylesheet' href={asset('/css/app.css')} />
        <link rel='stylesheet' href={asset('/css/snow.css')} />
        <link rel='stylesheet' href={asset('/css/weather-icons/css/weather-icons.min.css')} />
        <link rel='apple-touch-icon' href={asset('/images/snow_cal_v2.png')} />
        <link rel='manifest' href='/manifest.json' />
        <title>Snow Tracker</title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
      </head>
      <body>
        <Component />
      </body>
    </html>
  )
}
