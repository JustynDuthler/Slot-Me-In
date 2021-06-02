const supertest = require('supertest');
const http = require('http');
const app = require('../src/app');

let server;
let userAuthToken;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
});

afterAll(() => {
  server.close();
})

/* update the user jwt for every test */
beforeEach(async () => {
  await request.get('/api/test/get_token')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      userAuthToken = data.body.auth_token;
    })
})

/*
---------------------------signup tests------------------------------------

  1. Signup with valid account  (200)
  2. Signup with existing email (409)

*/

test('Create Valid Account', async () => {
  await request.post('/api/users/signup')
    .send({name: 'Elon Musk', email: 'elonmusk@tesla.com', password: 'doge',
        birthdate: '1971-06-28T14:48:00.000Z'})
    .expect(201)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    });
})

test('Create Account With Existing Email', async () => {
  await request.post('/api/users/signup')
    .send({name: 'Jeff', email: 'jeff@ucsc.edu', password: 'slotmein123',
        birthdate: '1993-04-13T14:48:00.000Z'})
    .expect(409);
})

/*
---------------------------login tests------------------------------------

  1. Successful login               (200)
  2. Login with incorrect password  (401)
  3. Login with non-existing email  (404)

*/

test('Login With Valid Credentials', async () => {
  await request.post('/api/users/login')
    .send({email: 'jeff@ucsc.edu', password: 'PaSWord'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    });
})

test('Login With Incorrect Password', async () => {
  await request.post('/api/users/login')
    .send({email: 'jeff@ucsc.edu', password: 'password'})
    .expect(401);
})

test('Login With Non-Existing Email', async () => {
  await request.post('/api/users/login')
    .send({email: 'notareal@email.com', password: 'password'})
    .expect(404);
})

/*
---------------------------getUser tests------------------------------------

  1. getUser With Valid User Token    (200)
  2. getUser With Invalid User Token  (401)

*/

test('getUser With Valid User Token', async () => {
  await request.get('/api/users/getUser')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = {
        userid: expect.any(String),
        username: expect.any(String),
        useremail: expect.any(String),
        birthdate: expect.any(String),
      };
      expect(data.body).toEqual(expected);
    })
})

test('getUser With Invalid User Token', async () => {
  await request.get('/api/users/getUser')
  .set({'Authorization': 'Bearer ' + '23456dfgh45tyusdfg45t'})
  .expect(401);
})

/*
---------------------------getUserEvents tests------------------------------------

  1. getUserEvents With Valid User Token    (200)
  2. getUserEvents With Invalid User Token  (401)

*/

test('getUserEvents With Valid User Token', async () => {
  await request.get('/api/users/getUserEvents')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = [{
        eventid: expect.any(String),
        eventname: expect.any(String),
        description: expect.any(String),
        businessid: expect.any(String),
        businessname: expect.any(String),
        starttime: expect.any(String),
        endtime: expect.any(String),
        capacity: expect.any(Number),
        membersonly: expect.any(Boolean),
        over18: expect.any(Boolean),
        over21: expect.any(Boolean),
        category: expect.any(String),
        attendees: expect.any(Number)
      }];
      expect(data.body).toEqual(expect.arrayContaining(expected));
    })
})

test('getUserEvents With Invalid User Token', async () => {
  await request.get('/api/users/getUserEvents')
  .set({'Authorization': 'Bearer ' + '23456dfgh45tyusdfg45t'})
  .expect(401);
})

/*
---------------------------removeUserAttending tests------------------------------------

  1. removeUserAttending With Valid Event ID    (200)
  2. removeUserAttending With Invalid Event ID  (403)

*/

// removeUserAttending from event that user is already signed up for
test('removeUserAttending From Valid Event', async () => {
  await request.delete('/api/users/removeUserAttending')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .send({eventid: '00000000-0001-0000-0000-000000000000'})
    .expect(200);
})

// removeUserAttending from event that user is not signed up for
test('removeUserAttending From Invalid Event', async () => {
  await request.delete('/api/users/removeUserAttending')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .send({eventid: '00000000-0003-0000-0000-000000000000'})
    .expect(403);
})