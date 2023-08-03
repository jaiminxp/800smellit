export function formatDate(date: Date) {
  let day: number | string = date.getDate()
  let month: number | string = date.getMonth() + 1
  const year: number = date.getFullYear()

  day = day >= 10 ? day : '0' + day
  month = month >= 10 ? month : '0' + month

  const formattedDate = year + '-' + month + '-' + day

  return formattedDate
}

export function formatTime(date: Date) {
  let hours: number | string = date.getHours()
  let minutes: number | string = date.getMinutes()

  hours = hours >= 10 ? hours : '0' + hours
  minutes = minutes >= 10 ? minutes : '0' + minutes

  return `${hours}:${minutes}`
}

export function resolvePath(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: Record<string, any>,
  path: string,
  separator: string,
) {
  return path.split(separator).reduce((p, c) => (p && p[c]) || null, obj)
}

export function mergeURL(baseURL: string, endpoint: string) {
  let requestURL = baseURL

  if (baseURL && endpoint) {
    requestURL = [baseURL, '/', endpoint].join('')
  } else if (endpoint) {
    requestURL = endpoint
  }

  return requestURL
}

export async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result
      if (result) {
        resolve(result.toString())
      } else {
        reject('')
      }
    })
    reader.readAsDataURL(file)
  })
}

export function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' || value instanceof Number
}

export function createQueryString(query: object) {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    params.set(key, value)
  })

  return params.toString()
}
