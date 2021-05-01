import { agent as Agent } from 'supertest'
import path from 'path'
import ejs from 'ejs'
import fs from 'fs'
import methods from 'methods'
import AutoDocRequest from './AutoDocRequest'
import {parseParams} from './utils'
import {ejsTemplateDir, outputHtmlDir} from './constants'

class AutoDocAgent extends Agent {
  docMetaCollection = []
  outputDir = outputHtmlDir
  templateDir = ejsTemplateDir

  constructor(app, options) {
    super(app, options);

    if (options) {
      this.outputDir = options.outputDir || outputHtmlDir
      this.templateDir = options.templateDir || ejsTemplateDir
    }
  }

  getDocMeta(method, url) {
    const docMeta = this.docMetaCollection.find(d => d.request.method === method && d.request.url === url)
    return docMeta || null
  }

  // Render html file using ejs template engine
  render(options, ejsOptions = {}) {
    const { outputFilename } = options

    // No output filename
    if (!outputFilename) throw new Error('Please give an output html filename')

    // ejs data
    const data = {
      docMetaCollection: this.docMetaCollection
    }

    // Render html with ejs template engine
    ejs.renderFile(path.join(this.templateDir, 'index.ejs'), data, ejsOptions, (err, html) => {
      if (err) throw err

      // Create dir
      if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir);

      // Output html file
      fs.writeFileSync(path.join(this.outputDir, outputFilename), html)
    })
  }
}

// Override HTTP verb methods
methods.forEach(function(method) {
  AutoDocAgent.prototype[method] = function(url, options = {}) {
    const {title, description} = options

    // Create a new doc meta
    const newDocMeta = {
      title,
      description,
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
