import { useState, useEffect } from 'react'
import urlJoin from 'url-join'
import config from '../config.js'

const host = urlJoin(config.apiHost, config.gqlEndpoint)

export function useRequest({ query, operationName = null } = {}) {
  const [response, setResponse] = useState(null)

  useEffect(() => {
    request({ query, operationName }).then(setResponse).catch(setResponse)
  }, [query, operationName])

  if (response === null) return [null, true]
  if (response && response.message) return [null, false, response]
  return [response.data, false]
}

export async function request({ query, operationName = null } = {}) {
  let response = await fetch(host, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operationName,
      query,
    }),
  })
  if (!response.ok) {
    let error = `Request Failure ${response.statusCode}`
    try {
      let body = await response.json()
      error = new Error(JSON.parse(body).message || error)
      // eslint-disable-next-line no-empty
    } catch (e) {}
    throw new Error(error)
  }
  return response.json()
}
