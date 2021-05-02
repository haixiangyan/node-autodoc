/**
 * Get the search param from a given url
 * e.g. xxx.com?a=1&b=2 -> {a: 1, b: 2}
 */
export const parseParams = (url) => {
  const [, searchStr] = url.split('?')

  if (!searchStr) return {}

  return searchStr.split('&').reduce((prev, curt) => {
    const [key, value] = curt.split('=')

    prev[key] = value

    return prev
  }, {})
}

const padLeft = (num) => {
  return num < 10 ? `0${num}` : num.toString()
}

// Get today date string
export const today = () => {
  const now = new Date()

  const year = now.getFullYear()
  const month = padLeft(now.getMonth() + 1)
  const date = padLeft(now.getDate())

  const hours = padLeft(now.getHours())
  const minutes = padLeft(now.getMinutes())
  const seconds = padLeft(now.getSeconds())

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}
