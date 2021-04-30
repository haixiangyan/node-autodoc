import http from 'http'
import methods from 'methods'
import AutoDocRequest from './AutoDocRequest'
import {parseParams} from './utils'

function request(app) {
  const obj = {}
  const docMeta = {
    request: {},
    response: {}
  }

  if (typeof app === 'function') {
    app = http.createServer(app)
  }

  methods.forEach(function(method) {
    obj[method] = function(url) {

      // Collect request info
      docMeta.request = {
        ...docMeta.request,
        url,
        method,
        params: parseParams(url),
      }

      return new AutoDocRequest(app, method, url, docMeta)
    }
  })

  obj.del = obj.delete
  obj.docMeta = docMeta

  return obj
}

export default request
