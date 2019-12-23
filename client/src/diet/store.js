import { request } from '../http/client'

const dietQuery = `
query {
  dietLogs{
    id
    date
    fat
    weight
    protein
    carbs
    calories
  }
}
`

export const getDietLogs = async () => {
  let response = await request({ query: dietQuery })
  return response.data.dietLogs.map(fromApi)
}

function fromApi(item) {
  return {
    ...item,
    // The server time is UTC, we want to sidestep timezone issues
    date: new Date(item.date.replace(/-/g, '/').replace(/T.+/, ''))
  }
}
