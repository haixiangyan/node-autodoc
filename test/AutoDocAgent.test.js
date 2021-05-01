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
      .get('/?a=1&b=2')
      .send('hello')
      .end(function (err, res) {
        if (err) return done(err);
        // supertest assertion
        expect(res.body.hostname).toEqual('something.test')

        // Get docMeta
        const docMeta = agent.getDocMeta('get', '/?a=1&b=2')
        expect(docMeta).not.toBeNull()

        const {request, response} = docMeta

        // Request assertion
        expect(request.method).toEqual('get')
        expect(request.url).toEqual('/?a=1&b=2')
        expect(request.body).toEqual('hello')
        expect(request.params).toEqual({a: '1', b: '2'});

        // Response assertion
        expect(response.body).toEqual({hostname: 'something.test'})

        agent.render()
        done();
      })
  });
});
