import urlJoin from 'url-join'
import config from '../config.js'

const host = urlJoin(config.apiHost, config.gqlEndpoint)

export async function request({ query, operationName = null } = {}) {
  let response = await fetch(host, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operationName,
      query
    })
  })
  if (!response.ok) {
    let error = `Request Failure ${response.statusCode}`
    try {
      let body = await response.json()
      error = new Error(JSON.parse(body).message || error)
    } catch (e) {}
    throw new Error(error)
  }
  return response.json()
}
