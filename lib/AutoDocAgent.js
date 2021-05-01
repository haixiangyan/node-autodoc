import { agent as Agent } from 'supertest'
import path from 'path'
import ejs from 'ejs'
import fs from 'fs'
import methods from 'methods'
import AutoDocRequest from './AutoDocRequest'
import {parseParams} from './utils'
import {ejsTemplateDir, outputHtmlDir} from './constants'
import * as url from 'url'

class AutoDocAgent extends Agent {
  // Output
  outputDir = outputHtmlDir
  templateDir = ejsTemplateDir
  outputFilename = ''

  // Document
  title = ''
  description = ''

  // Collection
  docMetaCollection = []

  constructor(app, options) {
    super(app, options);

    if (options) {
      // Output info
      this.outputDir = options.outputDir || outputHtmlDir
      this.templateDir = options.templateDir || ejsTemplateDir
      this.outputFilename = options.outputFilename || ''

      // Document info
      this.title = options.title || this.outputFilename
      this.description = options.description || ''
    }
  }

  getDocMeta(method, url) {
    const docMeta = this.docMetaCollection.find(d => d.request.method === method && d.request.url === url)
    return docMeta || null
  }

  // Render html file using ejs template engine
  render(options, ejsOptions = {}) {
    // No output filename
    if (!this.outputFilename) throw new Error('Please give an output html filename')

    // ejs data
    const ejsData = {
      title: this.title,
      description: this.description,
      docMetaCollection: this.docMetaCollection,
      tableOfContent: this.docMetaCollection.map(docMeta => ({
        link: `#${encodeURIComponent(docMeta.title)}`,
        title: docMeta.title
      }))
    }

    // Render html with ejs template engine
    ejs.renderFile(path.join(this.templateDir, 'index.ejs'), ejsData, ejsOptions, (err, html) => {
      if (err) throw err

      // Create dir
      if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir);

      // Output html file
      fs.writeFileSync(path.join(this.outputDir, this.outputFilename), html)
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
