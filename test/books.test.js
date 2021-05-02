import express from 'express'
import AutoDocAgent from '../lib/index'

const app = express();
const agent = new AutoDocAgent(app, {
  outputFilename: 'books.html',
  title: 'books API Documentation',
  description: 'A small and simple documentation for how to deal with /books api'
});

app.get('/books', function (req, res) {
  res.send({ msg: 'get success', code: 0 });
});

app.post('/books', function (req, res) {
  res.json({ msg: 'post success', code: 0 })
})

describe('AutoDocAgent', function () {
  it('should get correct docMeta from get request', function (done) {
    agent
      .get('/books?a=1&b=2', { title: 'Get all books', description: 'Send a get request to get all books from the server' })
      .end(function (err, res) {
        if (err) return done(err);
        // Get docMeta
        const docMeta = agent.getDocMeta('get', '/books?a=1&b=2')
        expect(docMeta).not.toBeNull()

        const {request, response} = docMeta

        // title and description
        expect(docMeta.title).toEqual('Get all books')
        expect(docMeta.description).toEqual('Send a get request to get all books from the server')

        // Request assertion
        expect(request.method).toEqual('get')
        expect(request.url).toEqual('/books?a=1&b=2')
        expect(request.params).toEqual({a: '1', b: '2'});

        // Response assertion
        expect(response.body).toEqual({ msg: 'get success', code: 0 })

        done();
      })
  });

  it('should get correct docMeta from post request', function (done) {
    agent
      .post('/books?a=1&b=2', { title: 'Post a user', description: 'Create a user and add it to the database' })
      .send({ name: 'Jack', password: '123' })
      .end(function (err, res) {
        if (err) return done(err);
        // Get docMeta
        const docMeta = agent.getDocMeta('post', '/books?a=1&b=2')
        expect(docMeta).not.toBeNull()

        const {request, response} = docMeta

        // title and description
        expect(docMeta.title).toEqual('Post a user')
        expect(docMeta.description).toEqual('Create a user and add it to the database')

        // Request assertion
        expect(request.method).toEqual('post')
        expect(request.url).toEqual('/books?a=1&b=2')
        expect(request.body).toEqual({ name: 'Jack', password: '123' })
        expect(request.params).toEqual({a: '1', b: '2'});

        // Response assertion
        expect(response.body).toEqual({ msg: 'post success', code: 0 })
        done();
      })
  });

  afterAll(() => agent.renderPage('books.html'))
});
