import express from 'express'
import AutoDocAgent from '../lib/index'

describe('AutoDocAgent', function () {
  it('should get correct docMeta from get request', function (done) {
    const app = express();
    const agent = new AutoDocAgent(app);

    app.get('/', function (req, res) {
      res.send({ hostname: req.hostname });
    });

    agent
      .host('something.test')
      .get('/')
      .send('hello')
      .end(function (err, res) {
        if (err) return done(err);
        // supertest assertion
        expect(res.body.hostname).toEqual('something.test')

        // Get docMeta
        const docMeta = agent.getDocMeta('get', '/')
        expect(docMeta).not.toBeNull()

        const {request, response} = docMeta

        // Request assertion
        expect(request.method).toEqual('get')
        expect(request.url).toEqual('/')
        expect(request.body).toEqual('hello')

        // Response assertion
        expect(response.body).toEqual({hostname: 'something.test'})

        done();
      });
  });
});
