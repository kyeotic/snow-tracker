import path from 'path'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import { createRequestHandler, type GetLoadContextFunction } from '@remix-run/express'
import { run, SnowReport } from './worker/worker'

const port = process.env.PORT || 3000
const BUILD_DIR = process.env.BUILD_DIR || path.join(process.cwd(), 'build')

let snowReport: SnowReport
run((s) => {
  console.log('updating report', s?.meadows?.updatedOn, s?.meadows?.lifts?.updatedOn)
  snowReport = s
})

const app = express()
const remixContext = {
  port,
}
const getLoadContext: GetLoadContextFunction = () => remixContext

app.use(compression())

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by')

// Remix fingerprints its assets so we can cache forever.
app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }))

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }))

app.use(morgan('tiny'))

app.get('/snow-report', (req, res) => {
  console.log('GET /snow-report', snowReport?.meadows?.lifts?.updatedOn)
  res.send(snowReport)
  // res.send({})
})

app.all(
  '*',
  process.env.NODE_ENV === 'development'
    ? (req, res, next) => {
        purgeRequireCache()

        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
          getLoadContext,
        })(req, res, next)
      }
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
        getLoadContext,
      })
)

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key]
    }
  }
}
