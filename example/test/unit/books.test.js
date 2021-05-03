import { booksAgent } from '../utils/constants';

describe('/books API', () => {
  it('should get correct docMeta from get request', (done) => {
    booksAgent
      .get('/books?a=1&b=2', { title: 'Get all books', description: 'Send a get request to get all books from the server' })
      .expect(200) // supertest
      .end((err, res) => {
        expect(res.body).toEqual({ msg: 'get books success', code: 0 });
        done();
      });
  });

  it('should get correct docMeta from post request', (done) => {
    booksAgent
      .post('/books?a=1&b=2', { title: 'Post a user', description: 'Create a user and add it to the database' })
      .send({ name: 'Jack', password: '123' })
      .expect(200) // supertest
      .end((err, res) => {
        expect(res.body).toEqual({ msg: 'post a book success', code: 0 });
        done();
      });
  });

  afterAll(() => booksAgent.renderPage());
});
