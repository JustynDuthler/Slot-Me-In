const supertest = require('supertest');
const http = require('http');
const app = require('../src/app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
});

afterAll(() => {
  server.close();
})

/*
---------------------------getTotalAttendees tests------------------------------------

  1. get the attendees for a valid event (200)
  2. get the attendees from a non existant event (200)

*/
test('Get Number of Attendees From Event Test', async() => {
  await request.get('/api/attendees/00000000-0003-0000-0000-000000000000')
  .expect(200)
  .expect('Content-Type', /json/)
  .then(data => {
    expect(data).toBeDefined();
    expect(data.body).toBeDefined();
    const expected = [{
      eventid: expect.any(String),
      userid: expect.any(String)
    }];
    expect(data.body).toEqual(expect.arrayContaining(expected));
  })
})

test('Get Number of Attendees From Non Existant Event Test', async() => {
  await request.get('/api/attendees/00000000-0017-0000-0000-000000000000')
  .expect(200)
  .expect('Content-Type', /json/)
  .then(data => {
    expect(data).toBeDefined();
    expect(data.body).toBeDefined();
    const expected = [];
    expect(data.body).toEqual(expect.arrayContaining(expected));
  })
})