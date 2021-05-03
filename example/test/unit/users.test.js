import { usersAgent } from '../utils/constants';

describe('/users API', () => {
  it('should get correct docMeta from get request', (done) => {
    usersAgent
      .get('/users?a=1&b=2', { title: 'Get all users', description: 'Send a get request to get all users from the server' })
      .expect(200)
      .end((err, res) => {
        expect(res.body).toEqual({ msg: 'get users success', code: 0 });
        done();
      });
  });

  it('should get correct docMeta from post request', (done) => {
    usersAgent
      .post('/users?a=1&b=2', { title: 'Post a user', description: 'Create a user and add it to the database' })
      .send({ name: 'Jack', password: '123' })
      .expect(200)
      .end((err, res) => {
        // Response assertion
        expect(res.body).toEqual({ msg: 'post a user success', code: 0 });
        done();
      });
  });

  afterAll(() => usersAgent.renderPage('users.html'));
});
