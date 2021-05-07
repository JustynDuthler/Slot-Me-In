const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../src/app');


let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  console.log("HERE");
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

test('GET Invalid URL', async () => {
  await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
    .expect(404);
});

test('Test Token', async () => {
  await request.get('/api/test/get_token')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.auth_token).toBeDefined();
      request.get('/api/users/getUser', {Headers: {Authorization: 'Bearer ' + data.body.auth_token}})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(data => {
        expect(data).toBeDefined();
        expect(data.body).toBeDefined();
        expect(data.body.userid).toBeDefined();
        expect(data.body.useremail).toBeDefined();
        expect(data.body.username).toBeDefined();
      })
    });
});

