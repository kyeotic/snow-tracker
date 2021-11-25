import { useReducer, useEffect, useCallback } from 'react'
import urlJoin from 'url-join'
import config from '../config.js'

const host = urlJoin(config.apiHost, config.gqlEndpoint)

const initialRequest = { isLoading: true, data: null, error: null }
function reqeustReducer(state, action) {
  switch (action.type) {
    case 'pending':
      return {
        ...state,
        isLoading: true,
      }
    case 'success':
      return {
        isLoading: false,
        data: action.payload,
        error: null,
      }
    case 'error':
      return {
        isLoading: false,
        data: null,
        error: action.payload,
      }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

export function useRequest({ query, operationName = null } = {}) {
  const [state, dispatch] = useReducer(reqeustReducer, initialRequest)

  const refresh = useCallback(() => {
    dispatch({ type: 'pending' })
    request({ query, operationName })
      .then((r) => {
        dispatch({ type: 'success', payload: r.data })
      })
      .catch((e) => {
        dispatch({ type: 'error', payload: e })
      })
  }, [])

  useEffect(() => {
    refresh()
  }, [query, operationName])

  return { ...state, refresh }
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
