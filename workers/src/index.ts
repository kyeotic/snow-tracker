import config from './config'

const query = `{"operationName":null,"query":" query {   timberline {     ...summary   }   skiBowl {     ...summary   }   meadows {     ...summary   } } fragment summary on SnowStatus {   updatedOn   condition {     updatedOn     temperature     condition     iconClass   }   snowfalls {     since     depth   }   lifts {     updatedOn     liftStatuses {       name       status       hours     }   }   forecast {     name     temperature     startTime     isDaytime     temperatureUnit     temperatureTrend     windSpeed     icon     shortForecast     detailedForecast   } } "}`

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

addEventListener('scheduled', (event) => {
  event.waitUntil(handleSchedule())
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handleRequest(req: Request): Promise<Response> {
  await handleSchedule()
  return new Response(`Success`)
}

async function handleSchedule() {
  const response = await fetch(config.api, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: query,
  })

  const data = JSON.stringify(await response.json())
  // const result = JSON.stringify(data, null, 2)
  // console.log(response.ok, data)

  await snow.put('conditions', data)
}
