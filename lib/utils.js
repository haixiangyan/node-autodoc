/**
 * Get the search param from a given url
 * e.g. xxx.com?a=1&b=2 -> {a: 1, b: 2}
 */
export const parseParams = (url) => {
  const [, searchStr] = url.split('?')

  if (!searchStr) return {}

  return searchStr.split('&').reduce((curt, prev) => {
    const [key, value] = curt.split('=')

    prev[key] = value

    return prev
  }, {})
}
