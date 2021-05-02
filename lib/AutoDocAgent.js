import { agent as Agent } from 'supertest'
import path from 'path'
import ejs from 'ejs'
import fs from 'fs'
import methods from 'methods'
import AutoDocRequest from './AutoDocRequest'
import {parseParams} from './utils'
import {ejsTemplateDir, outputHtmlDir} from './constants'

class AutoDocAgent extends Agent {
  // Output
  outputDir = outputHtmlDir
  templateDir = ejsTemplateDir

  // Document
  title = ''
  description = ''

  // Collection
  docMetaCollection = []

  constructor(app, options) {
    super(app, options);

    if (options) {
      // Output info
      this.outputDir = AutoDocAgent.configuration ? AutoDocAgent.configuration.outputDir : outputHtmlDir
      this.templateDir = AutoDocAgent.configuration ? AutoDocAgent.configuration.templateDir : ejsTemplateDir

      // Document info
      this.title = options.title || 'Untitled'
      this.description = options.description || ''
    }
  }

  getDocMeta(method, url) {
    const docMeta = this.docMetaCollection.find(d => d.request.method === method && d.request.url === url)
    return docMeta || null
  }

  renderIndex(ejsOptions) {
    const ejsData = { pages: AutoDocAgent.pages }

    // Render html with ejs template engine
    ejs.renderFile(path.join(this.templateDir, 'index.ejs'), ejsData, ejsOptions, (err, html) => {
      if (err) throw err

      // Create dir
      if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir);

      // Output html file
      fs.writeFileSync(path.join(this.outputDir, 'index.html'), html)
    })
  }

  // Render html file using ejs template engine
  renderPage(outputFilename, ejsOptions = {}) {
    if (!outputFilename) throw new Error('No output file name')

    AutoDocAgent.pages.push({
      link: outputFilename,
      title: this.title,
      description: this.description,
    })

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
    ejs.renderFile(path.join(this.templateDir, 'document.ejs'), ejsData, ejsOptions, (err, html) => {
      if (err) throw err

      // Create dir
      if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir);

      // Output html file
      fs.writeFileSync(path.join(this.outputDir, outputFilename), html)
    })

    this.renderIndex()
  }
}

AutoDocAgent.pages = []

// config
AutoDocAgent.config = function(configuration) {
  AutoDocAgent.configuration = configuration
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
