const supertest = require('supertest');
const http = require('http');
const app = require('../src/app');

let server;
let businessAuthToken;
let userAuthToken;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
});

afterAll(() => {
  server.close();
})

/* update the business jwt for every test */
beforeEach(async () => {
  await request.get('/api/test/get_business_token')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      businessAuthToken = data.body.auth_token;
    })
})

beforeEach(async () => {
  await request.get('/api/test/get_token')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      userAuthToken = data.body.auth_token;
    })
})
/*
---------------------------getEvents tests------------------------------------

  1. business token getting events
  2. user token getting events
  3. bad token

*/
test('getEvents with business token', async () => {
  await request.get('/api/events')
    .set({'Authorization': 'Bearer ' + businessAuthToken})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body).toStrictEqual([
        {
          eventid: '00000000-0002-0000-0000-000000000000',
          eventname: 'Test Event 2',
          businessid: '10000000-0000-0000-0000-000000000000',
          starttime: '2021-05-02T10:30:00.000Z',
          endtime: '2021-05-02T12:30:00.000Z',
          capacity: 10,
          description: '',
          over18: true,
          over21: false,
          membersonly: true,
          category: 'party',
          attendees: 3
        }
    ]);
  })
})

test('getEvents with business token', async () => {
  await request.get('/api/events')
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
        starttime: expect.any(String),
        endtime: expect.any(String),
        capacity: expect.any(Number),
        membersonly: expect.any(Boolean),
        over18: expect.any(Boolean),
        over21: expect.any(Boolean),
        attendees: expect.any(Number)
      }];
      expect(data.body).toEqual(expect.arrayContaining(expected));
  })
})

test('getEvents with bad token', async () => {
  await request.get('/api/events')
    .set({'Authorization': 'Bearer ' + 'wsedrfvgbhnjmkdx345678'})
    .expect(401);
})

/*
---------------------------getEventByID tests------------------------------------

  1. sucessfully get an event by its ID
  2. invalid ID

*/
test('getEventByID', async () => {
  await request.get('/api/events/00000000-0019-0000-0000-000000000000')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = {
        eventid: expect.any(String),
        eventname: expect.any(String),
        description: expect.any(String),
        businessid: expect.any(String),
        starttime: expect.any(String),
        endtime: expect.any(String),
        capacity: expect.any(Number),
        repeatid: null,
        membersonly: expect.any(Boolean),
        over18: expect.any(Boolean),
        over21: expect.any(Boolean),
        category: null
      };
      expect(data.body).toEqual(expect.objectContaining(expected));
  })
})  

test('getEventByID bad eventID', async () => {
  await request.get('/api/events/00000000-0019-0006-0000-000100000000')
    .expect(404);
})  

/*
---------------------------signup tests------------------------------------

  1. successfully signed up for event
  2. user does not meet restrictions for event
  3. bad event id
  4. user already signed up
  5. user is not a member of business
  6. event is at capacity

*/
test('event sign up successful', async () => {
  await request.put('/api/events/00000000-0013-0000-0000-000000000000/signup')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(200);
})

test('event sign up unsuccessful due to restrictions', async () => {
  await request.put('/api/events/00000000-0019-0000-0000-000000000000/signup')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(403);
})

test('event sign up with bad event id', async () => {
  await request.put('/api/events/00000000-0067-0000-0000-000001200000/signup')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(404);
})

test('event sign up with user already signed up', async () => {
  await request.put('/api/events/00000000-0013-0000-0000-000000000000/signup')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(409);
})

test('event sign up with user not a member', async () => {
  await request.put('/api/events/00000000-0001-0000-0000-000000000000/signup')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(403);
})

test('event sign up with full event', async () => {
  await request.put('/api/events/00000000-0003-0000-0000-000000000000/signup')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(403);
})

/*
---------------------------publicEvents tests------------------------------------

  1. get all public events

*/
test('Get public events', async () => {
  await request.get('/api/events/publicEvents')
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
        starttime: expect.any(String),
        endtime: expect.any(String),
        capacity: expect.any(Number),
        repeatid: null,
        membersonly: expect.any(Boolean),
        over18: expect.any(Boolean),
        over21: expect.any(Boolean),
        category: null,
        attendees: expect.any(Number)
      }];
      expect(data.body).toEqual(expect.arrayContaining(expected));
    })
})

/*
---------------------------publicAndMemberEvents tests------------------------------------

  1. get all public and member events events

*/
test('Get public and member events', async () => {
  await request.get('/api/events/publicAndMemberEvents/jeff@ucsc.edu')
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
        starttime: expect.any(String),
        endtime: expect.any(String),
        capacity: expect.any(Number),
        repeatid: null,
        membersonly: expect.any(Boolean),
        over18: expect.any(Boolean),
        over21: expect.any(Boolean),
        category: null,
        attendees: expect.any(Number)
      }];
      expect(data.body).toEqual(expect.arrayContaining(expected));
    })
})

/*
---------------------------get Categories tests------------------------------------

  1. get the categories from the database

*/
test('Get categories Test', async () => {
  await request.get('/api/events/categories')
    .expect(200)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = [{category: expect.any(String)}];
      expect(data.body).toEqual(expect.arrayContaining(expected));
    });
})