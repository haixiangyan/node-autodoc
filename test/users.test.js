import express from 'express'
import AutoDocAgent from '../lib/index'

const app = express();
const agent = new AutoDocAgent(app, {
  title: 'Users API Documentation',
  description: 'A small and simple documentation for how to deal with /users api'
});

app.get('/users', function (req, res) {
  res.send({ msg: 'get success', code: 0 });
});

app.post('/users', function (req, res) {
  res.json({ msg: 'post success', code: 0 })
})

describe('AutoDocAgent', function () {
  it('should get correct docMeta from get request', function (done) {
    agent
      .get('/users?a=1&b=2', { title: 'Get all users', description: 'Send a get request to get all users from the server' })
      .end(function (err, res) {
        if (err) return done(err);
        // Get docMeta
        const docMeta = agent.getDocMeta('get', '/users?a=1&b=2')
        expect(docMeta).not.toBeNull()

        const {request, response} = docMeta

        // title and description
        expect(docMeta.title).toEqual('Get all users')
        expect(docMeta.description).toEqual('Send a get request to get all users from the server')

        // Request assertion
        expect(request.method).toEqual('get')
        expect(request.url).toEqual('/users?a=1&b=2')
        expect(request.params).toEqual({a: '1', b: '2'});

        // Response assertion
        expect(response.body).toEqual({ msg: 'get success', code: 0 })

        done();
      })
  });

  it('should get correct docMeta from post request', function (done) {
    agent
      .post('/users?a=1&b=2', { title: 'Post a user', description: 'Create a user and add it to the database' })
      .send({ name: 'Jack', password: '123' })
      .end(function (err, res) {
        if (err) return done(err);
        // Get docMeta
        const docMeta = agent.getDocMeta('post', '/users?a=1&b=2')
        expect(docMeta).not.toBeNull()

        const {request, response} = docMeta

        // title and description
        expect(docMeta.title).toEqual('Post a user')
        expect(docMeta.description).toEqual('Create a user and add it to the database')

        // Request assertion
        expect(request.method).toEqual('post')
        expect(request.url).toEqual('/users?a=1&b=2')
        expect(request.body).toEqual({ name: 'Jack', password: '123' })
        expect(request.params).toEqual({a: '1', b: '2'});

        // Response assertion
        expect(response.body).toEqual({ msg: 'post success', code: 0 })
        done();
      })
  });

  afterAll(() => agent.renderPage('users.html'))
});
