import { agent as Agent } from 'supertest'
import methods from 'methods'
import AutoDocRequest from './AutoDocRequest'
import {parseParams} from './utils'

class AutoDocAgent extends Agent {
  docMetaCollection = []

  constructor(app, options) {
    super(app, options);
  }

  getDocMeta(method, url) {
    const docMeta = this.docMetaCollection.find(d => d.request.method === method && d.request.url === url)
    return docMeta || null
  }
}

// Override HTTP verb methods
methods.forEach(function(method) {
  AutoDocAgent.prototype[method] = function(url) {
    // Create a new doc meta
    const newDocMeta = {
      request: {
        url,
        method,
        params: parseParams(url),
      },
      response: {}
    }

    this.docMetaCollection.push(newDocMeta)

    // The codes below are from supertest/superagent
    // Init request
    const req = new AutoDocRequest(this.app, method.toLowerCase(), url, newDocMeta)

    // https
    req.ca(this._ca)
    req.key(this._key)
    req.cert(this._cert)

    // host
    if (this._host) {
      req.set('host', this._host)
    }

    // http 返回时保存 Cookie
    req.on('response', this._saveCookies.bind(this))
    // 重定向除了保存 Cookie，同时附带上 Cookie
    req.on('redirect', this._saveCookies.bind(this))
    req.on('redirect', this._attachCookies.bind(this))

    // 本次请求就带上 Cookie
    this._attachCookies(req)
    this._setDefaults(req)

    return req
  };
});

export default AutoDocAgent
