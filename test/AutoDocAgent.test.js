import express from 'express'
import request from '../lib'
import AutoDocAgent from '../lib/AutoDocAgent'

describe('request(app)', () => {
  it('should get obj.docMeta from get request', (done) => {
    const app = express();

    app.get('/', function (req, res) {
      res.send('hey');
    });

    const obj = request(app)
    obj.get('/')
      .send({name: 'Jack', password: '123456'})
      .end(function (err, res) {
        // supertest assertion
        expect(res.status).toEqual(200)
        expect(res.text).toEqual('hey')

        const {request, response} = obj.docMeta

        // Request assertion
        expect(request.url).toEqual('/')
        expect(request.method).toEqual('get')
        expect(request.body).toEqual({name: 'Jack', password: '123456'})

        // Response Assertion
        expect(response.text).toEqual('hey')

        done();
      })
  })
})

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
