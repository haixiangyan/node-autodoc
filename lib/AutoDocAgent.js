import { agent as Agent } from 'supertest'
import methods from 'methods'
import AutoDocRequest from './AutoDocRequest'
import {parseParams} from './utils'

const getDocMetaKey = (method, url) => `${method} ${url}`

class AutoDocAgent extends Agent {
  docMetaCollections = {}

  constructor(app, options) {
    super(app, options);
  }

  getDocMeta(method, url) {
    const key = getDocMetaKey(method, url)
    return this.docMetaCollections[key] || null
  }
}

// Override HTTP verb methods
methods.forEach(function(method) {
  AutoDocAgent.prototype[method] = function(url) {
    // Create a new doc meta
    this.docMetaCollections[`${method} ${url}`] = {
      request: {
        url,
        method,
        params: parseParams(url),
      },
      response: {}
    }

    const key = getDocMetaKey(method, url)

    // The codes below are from supertest/superagent
    // Init request
    const req = new AutoDocRequest(this.app, method.toLowerCase(), url, this.docMetaCollections[key])

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
