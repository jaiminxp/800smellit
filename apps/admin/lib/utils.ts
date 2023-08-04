export const createQueryString = (query: object) => {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    params.set(key, value)
  })

  return params.toString()
}
