import { agent as Agent } from 'supertest';
import path from 'path';
import ejs from 'ejs';
import fsExtra from 'fs-extra';
import methods from 'methods';
import AutoDocRequest from './AutoDocRequest';
import { parseParams, today } from './utils';
import { ejsTemplateDir } from './constants';

class AutoDocAgent extends Agent {
  // Output info
  outputDir = ''

  templateDir = ''

  // Document
  title = ''

  description = ''

  outputFilename = ''

  // Collection
  docMetaCollection = []

  constructor(app, options) {
    super(app, options);

    if (options) {
      // Document info
      this.title = options.title || 'Untitled';
      this.description = options.description || '';
      this.outputFilename = options.outputFilename;
      this.outputDir = options.outputDir;
      this.templateDir = options.templateDir || ejsTemplateDir;
    }
  }

  getDocMeta(method, url) {
    const docMeta = this.docMetaCollection.find((d) => d.request.method === method && d.request.url === url);
    return docMeta || null;
  }

  // Render html file using ejs template engine
  renderPage(customRenderPage, ejsOptions = {}) {
    if (customRenderPage) return customRenderPage(this);

    if (!this.outputFilename) throw new Error('No output file name');

    // ejs data
    const ejsData = {
      title: this.title,
      description: this.description,
      docMetaCollection: this.docMetaCollection,
      tableOfContent: this.docMetaCollection.map((docMeta) => ({
        link: `#${encodeURIComponent(docMeta.title)}`,
        title: docMeta.title,
      })),
    };

    // Render html with ejs template engine
    ejs.renderFile(path.join(this.templateDir, 'document.ejs'), ejsData, ejsOptions, (err, html) => {
      if (err) throw err;

      // Create dir
      fsExtra.ensureDirSync(this.outputDir);

      // Output html file
      fsExtra.outputFileSync(path.join(this.outputDir, this.outputFilename), html);
    });
  }
}

// Clear the output directory
AutoDocAgent.clear = function clear(outputDir) {
  fsExtra.emptyDirSync(path.resolve(outputDir));
};

// Render the home page
AutoDocAgent.renderIndex = function renderIndex(options, ejsOptions) {
  const {
    author, createdAt, title, description, agents, outputDir, templateDir = ejsTemplateDir,
  } = options;

  if (!agents) throw new Error('Agent list is empty');

  // Use agents to generate content of table
  const pages = agents.map((agent) => ({
    link: agent.outputFilename,
    title: agent.title,
    description: agent.description,
  }));

  const ejsData = {
    author,
    pages,
    title,
    description,
    createdAt: createdAt || today(),
  };

  // Render html with ejs template engine
  ejs.renderFile(path.join(templateDir, 'index.ejs'), ejsData, ejsOptions, (err, html) => {
    if (err) throw err;

    // Create dir
    fsExtra.ensureDirSync(outputDir);

    // Output html file
    fsExtra.outputFileSync(path.join(outputDir, 'index.html'), html);
  });
};

// Override HTTP verb methods
methods.forEach((method) => {
  AutoDocAgent.prototype[method] = function restfulFn(url, options = {}) {
    const { title, description } = options;

    // Create a new doc meta
    const newDocMeta = {
      title,
      description,
      request: {
        url,
        method,
        params: parseParams(url),
      },
      response: {},
    };

    this.docMetaCollection.push(newDocMeta);

    // The codes below are from supertest/superagent
    // Init request
    const req = new AutoDocRequest(this.app, method.toLowerCase(), url, newDocMeta);

    // https
    req.ca(this._ca);
    req.key(this._key);
    req.cert(this._cert);

    // host
    if (this._host) {
      req.set('host', this._host);
    }

    // http ??????????????? Cookie
    req.on('response', this._saveCookies.bind(this));
    // ????????????????????? Cookie?????????????????? Cookie
    req.on('redirect', this._saveCookies.bind(this));
    req.on('redirect', this._attachCookies.bind(this));

    // ????????????????????? Cookie
    this._attachCookies(req);
    this._setDefaults(req);

    return req;
  };
});

export default AutoDocAgent;
