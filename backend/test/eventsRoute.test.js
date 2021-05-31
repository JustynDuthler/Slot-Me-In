const supertest = require('supertest');
const http = require('http');
const app = require('../src/app');

let server;
let businessAuthToken;
let userAuthToken;
let repeatTestID;

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

  1. business token getting events  (200)
  2. user token getting events      (200)
  3. bad token                      (401)

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

  1. sucessfully get an event by its ID (200)
  2. invalid ID                         (404)

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

  1. successfully signed up for event           (200)
  2. user does not meet restrictions for event  (403)
  3. bad event id                               (404)
  4. user already signed up                     (409)
  5. user is not a member of business           (403)
  6. event is at capacity                       (403)

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

  1. get all public events (200)

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

  1. get all public and member events events (200)

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

  1. get the categories from the database (200)

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

/*
---------------------------events post tests------------------------------------

  1. successful creation of new event (201)
  2. successful creation of repeating event (201)
  3. bad business token (401)
  4. user token(403)

*/
test('Creation of New Event Test', async() => {
  await request.post('/api/events/')
    .set({'Authorization': 'Bearer ' + businessAuthToken})
    .send({
    eventname: 'Track Day',
    description: 'race event',
    starttime: '2021-06-01T09:00:00.000Z',
    endtime: '2021-06-01T12:00:00.000Z',
    capacity: 50,
    repeat: false,
    membersonly: true,
    over18: true,
    over21: false,
    category: "sport"
    })
    .expect(201)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body).toStrictEqual(      {
        eventname: 'Track Day',
        description: 'race event',
        starttime: '2021-06-01T09:00:00.000Z',
        endtime: '2021-06-01T12:00:00.000Z',
        capacity: 50,
        repeat: false,
        membersonly: true,
        over18: true,
        over21: false,
        category: 'sport',
        eventid: expect.any(String)
      });
    })
})

test('Creation of New Repeating Event Test', async() => {
  await request.post('/api/events/')
    .set({'Authorization': 'Bearer ' + businessAuthToken})
    .send({
    eventname: 'Snowboarding',
    description: 'pow',
    starttime: '2021-06-01T09:00:00.000Z',
    endtime: '2021-06-01T12:00:00.000Z',
    capacity: 50,
    repeat: true,
    repeattype: 'w',
    repeatdays: {
        sunday: false,
        monday: false, 
        tuesday: true,   
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
      },
    repeatstart: '2021-06-01T09:00:00.000Z',
    repeatend: '2021-06-29T09:00:00.000Z',
    membersonly: false,
    over18: false,
    over21: false,
    category: "sport"

    })
    .expect(201)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body).toStrictEqual(      {
        eventname: 'Snowboarding',
        description: 'pow',
        starttime: '2021-06-01T09:00:00.000Z',
        endtime: '2021-06-01T12:00:00.000Z',
        capacity: 50,
        repeat: true,
        repeattype: 'w',
        repeatdays: {
          sunday: false,
          monday: false,
          tuesday: true,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false
        },
        repeatend: '2021-06-29T09:00:00.000Z',
        repeatid: expect.any(String),
        repeatstart: '2021-06-01T09:00:00.000Z',
        membersonly: false,
        over18: false,
        over21: false,
        category: 'sport',
        eventid: expect.any(String)
      });
      repeatTestID = data.body.eventid;
    })
})

test('Creation of New Event Test Bad Business Token', async() => {
  await request.post('/api/events/')
    .set({'Authorization': 'Bearer ' + 'drfgvh34d5f6guh'})
    .send({
    eventname: 'Track Day',
    description: 'race event',
    starttime: '2021-06-01T09:00:00.000Z',
    endtime: '2021-06-01T12:00:00.000Z',
    capacity: 50,
    repeat: false,
    membersonly: true,
    over18: true,
    over21: false,
    category: "sport"
    })
    .expect(401)
})

test('Creation of New Event Test User Token', async() => {
  await request.post('/api/events/')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .send({
    eventname: 'Track Day',
    description: 'race event',
    starttime: '2021-06-01T09:00:00.000Z',
    endtime: '2021-06-01T12:00:00.000Z',
    capacity: 50,
    repeat: false,
    membersonly: true,
    over18: true,
    over21: false,
    category: "sport"
    })
    .expect(403)
})

/*
---------------------------events delete tests------------------------------------

  1. Successfully deleted event (200)
  2. Successfully deleted repeating event (200)
  3. Event not found (404)

*/
test('Delete Single Event Test', async () => {
  await request.delete('/api/events/00000000-0001-0000-0000-000000000000')
    .set({'Authorization': 'Bearer ' + businessAuthToken})
    .expect(200)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    })
})

test('Delete Repeating Event', async () => {
  await request.delete('/api/events/' + repeatTestID)
  .set({'Authorization': 'Bearer ' + businessAuthToken})
  .send({'deleteAll': true})
  .expect(200)
  .then(data => {
    expect(data).toBeDefined();
    expect(data.body).toBeDefined();
  })
})

test('Delete Event, Bad Event ID', async () => {
  await request.delete('/api/events/00000123-0001-0000-0000-000000000000')
  .set({'Authorization': 'Bearer ' + businessAuthToken})
  .expect(404)
})

/*
---------------------------getSearchEvents tests------------------------------------

  1. successfully retreived business events (200)
  2. successfully retrieved user events (200)

*/
test('Search Event Business ID', async () => {
  await request.get('/api/events/search/jeff@ucsc.edu')
    .set({'Authorization': 'Bearer ' + businessAuthToken})
    .send({
      start: '2021-05-03T16:30:00.000Z',
      end: '2021-06-30T16:30:00.000Z'
    })
    .expect(200)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = [{
        eventid: expect.any(String),
        eventname: expect.any(String),
        businessid: expect.any(String),
        starttime: expect.any(String),
        endtime: expect.any(String),
        capacity: expect.any(Number),
        description: expect.any(String),
        over18: expect.any(Boolean),
        over21: expect.any(Boolean),
        membersonly: expect.any(Boolean),
        category: expect.any(String),
        attendees: expect.any(Number)
      }];
      expect(data.body).toEqual(expect.arrayContaining(expected));
    })
})

test('Search Event User ID', async () => {
  await request.get('/api/events/search/jeff@ucsc.edu')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .send({
      start: '2021-05-03T16:30:00.000Z',
      end: '2021-06-30T16:30:00.000Z'
    })
    .expect(200)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = [{
        eventid: expect.any(String),
        eventname: expect.any(String),
        businessid: expect.any(String),
        starttime: expect.any(String),
        endtime: expect.any(String),
        capacity: expect.any(Number),
        description: expect.any(String),
        over18: expect.any(Boolean),
        over21: expect.any(Boolean),
        membersonly: expect.any(Boolean),
        category: expect.any(String),
        attendees: expect.any(Number)
      }];
      expect(data.body).toEqual(expect.arrayContaining(expected));
    })
})