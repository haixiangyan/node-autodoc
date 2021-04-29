import { Test as Request } from 'supertest'

class AutoDocRequest extends Request {
  docMeta = {
    request: {},
    response: {}
  }

  constructor(app, method, path, docMeta) {
    super(app, method, path)
    this.docMeta = docMeta
  }

  // Override send method to collect request body
  send(body) {
    this.docMeta.request = {
      ...this.docMeta.request,
      body,
    }

    return Request.prototype.send.call(this, body)
  }

  // Override end method to collect response
  end(fn) {
    return Request.prototype.end.call(this, (err, res) => {
      // Important info
      const { headers, statusCode, statusMessage, text, body, files } = res

      this.docMeta.response = {
        ...this.docMeta.response,
        headers,
        text,
        statusCode,
        statusMessage,
        body,
        files,
      }

      fn(err, res)
    })
  }
}

export default AutoDocRequest
