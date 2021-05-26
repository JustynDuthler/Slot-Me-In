const supertest = require('supertest');
const http = require('http');
const app = require('../src/app');
const { request } = require('express');

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
      expect(data.body).toStrictEqual([
        {
          eventid: '00000000-0019-0000-0000-000000000000',
          eventname: 'Wine Tasting',
          businessid: '00000000-0000-0000-0000-000000000000',
          starttime: '2021-09-15T23:30:00.000Z',
          endtime: '2021-09-16T02:30:00.000Z',
          capacity: 20,
          description: 'Temp Description',
          over18: false,
          over21: true,
          membersonly: false,
          attendees: 0
        },
        {
          eventid: '00000000-0018-0000-0000-000000000000',
          eventname: 'Photography Club Meet',
          businessid: '90000000-0000-0000-0000-000000000000',
          starttime: '2021-10-07T13:30:00.000Z',
          endtime: '2021-10-07T15:00:00.000Z',
          capacity: 30,
          description: 'Temp Description',
          over18: false,
          over21: false,
          membersonly: false,
          attendees: 0
        },
        {
          eventid: '00000000-0017-0000-0000-000000000000',
          eventname: 'Paint Westcliff',
          businessid: '90000000-0000-0000-0000-000000000000',
          starttime: '2021-10-07T13:30:00.000Z',
          endtime: '2021-10-07T15:00:00.000Z',
          capacity: 10,
          description: 'Temp Description',
          over18: false,
          over21: false,
          membersonly: false,
          attendees: 0
        },
        {
          eventid: '00000000-0016-0000-0000-000000000000',
          eventname: 'Group Run',
          businessid: '90000000-0000-0000-0000-000000000000',
          starttime: '2021-10-07T13:30:00.000Z',
          endtime: '2021-10-07T15:00:00.000Z',
          capacity: 20,
          description: 'Temp Description',
          over18: false,
          over21: false,
          membersonly: false,
          attendees: 0
        },
        {
          eventid: '00000000-0015-0000-0000-000000000000',
          eventname: 'Telescope viewing',
          businessid: '90000000-0000-0000-0000-000000000000',
          starttime: '2021-10-07T13:30:00.000Z',
          endtime: '2021-10-07T15:00:00.000Z',
          capacity: 15,
          description: 'Temp Description',
          over18: false,
          over21: false,
          membersonly: false,
          attendees: 0
        },
        {
          eventid: '00000000-0014-0000-0000-000000000000',
          eventname: 'Yoga in the park',
          businessid: '90000000-0000-0000-0000-000000000000',
          starttime: '2021-10-07T13:30:00.000Z',
          endtime: '2021-10-07T15:00:00.000Z',
          capacity: 15,
          description: 'Temp Description',
          over18: false,
          over21: false,
          membersonly: false,
          attendees: 0
        },
        {
          eventid: '00000000-0013-0000-0000-000000000000',
          eventname: 'Group Ride',
          businessid: '90000000-0000-0000-0000-000000000000',
          starttime: '2021-10-07T13:30:00.000Z',
          endtime: '2021-10-07T15:00:00.000Z',
          capacity: 25,
          description: 'Join the Santa Cruzes finest! on a group MTB ride.',
          over18: false,
          over21: false,
          membersonly: false,
          attendees: 0
        },
        {
          eventid: '00000000-0012-0000-0000-000000000000',
          eventname: 'Ocean Kayaking Club Meet',
          businessid: '90000000-0000-0000-0000-000000000000',
          starttime: '2021-10-07T13:30:00.000Z',
          endtime: '2021-10-07T15:00:00.000Z',
          capacity: 50,
          description: 'Join the santa cruz kayak club in an an ocean kayaking adventure. Bring a kayak and some food. Potluck afterwards',
          over18: false,
          over21: false,
          membersonly: false,
          category: 'sport',
          attendees: 0
        },
        {
          eventid: '00000000-0011-0000-0000-000000000000',
          eventname: 'Test Event 11',
          businessid: '90000000-0000-0000-0000-000000000000',
          starttime: '2021-10-07T13:30:00.000Z',
          endtime: '2021-10-07T15:00:00.000Z',
          capacity: 50,
          description: 'This is the description for Test Event 1.',
          over18: false,
          over21: false,
          membersonly: true,
          attendees: 0
        },
        {
          eventid: '00000000-0010-0000-0000-000000000000',
          eventname: 'Test Event 10',
          businessid: '90000000-0000-0000-0000-000000000000',
          starttime: '2021-09-07T13:30:00.000Z',
          endtime: '2021-09-07T15:00:00.000Z',
          capacity: 45,
          description: 'This is the description for Test Event 10.',
          over18: false,
          over21: false,
          membersonly: true,
          attendees: 1
        },
        {
          eventid: '00000000-0009-0000-0000-000000000000',
          eventname: 'Test Event 9',
          businessid: '80000000-0000-0000-0000-000000000000',
          starttime: '2021-08-06T11:45:00.000Z',
          endtime: '2021-08-06T12:45:00.000Z',
          capacity: 25,
          description: 'This is the description for Test Event 9.',
          over18: false,
          over21: false,
          membersonly: true,
          category: 'job fair',
          attendees: 1
        },
        {
          eventid: '00000000-0008-0000-0000-000000000000',
          eventname: 'Test Event 8',
          businessid: '70000000-0000-0000-0000-000000000000',
          starttime: '2021-07-06T15:00:00.000Z',
          endtime: '2021-07-06T19:30:00.000Z',
          capacity: 90,
          description: 'This is the description for Test Event 8.',
          over18: false,
          over21: false,
          membersonly: true,
          category: 'concert',
          attendees: 1
        },
        {
          eventid: '00000000-0007-0000-0000-000000000000',
          eventname: 'Test Event 7',
          businessid: '60000000-0000-0000-0000-000000000000',
          starttime: '2021-06-05T07:30:00.000Z',
          endtime: '2021-06-05T08:00:00.000Z',
          capacity: 50,
          description: 'This is the description for Test Event 7.',
          over18: false,
          over21: false,
          membersonly: true,
          category: 'workshop',
          attendees: 1
        },
        {
          eventid: '00000000-0006-0000-0000-000000000000',
          eventname: 'Test Event 6',
          businessid: '50000000-0000-0000-0000-000000000000',
          starttime: '2021-05-04T10:30:00.000Z',
          endtime: '2021-05-04T14:00:00.000Z',
          capacity: 20,
          description: 'This is the description for Test Event 6.',
          over18: false,
          over21: false,
          membersonly: true,
          category: 'meeting',
          attendees: 2
        },
        {
          eventid: '00000000-0005-0000-0000-000000000000',
          eventname: 'Test Event 5',
          businessid: '40000000-0000-0000-0000-000000000000',
          starttime: '2021-05-03T16:30:00.000Z',
          endtime: '2021-05-03T18:00:00.000Z',
          capacity: 8,
          description: 'This is the description for Test Event 5.',
          over18: false,
          over21: false,
          membersonly: true,
          category: 'cooking',
          attendees: 3
        },
        {
          eventid: '00000000-0004-0000-0000-000000000000',
          eventname: 'Test Event 4',
          businessid: '30000000-0000-0000-0000-000000000000',
          starttime: '2021-05-03T08:20:00.000Z',
          endtime: '2021-05-03T09:22:00.000Z',
          capacity: 5,
          description: 'This is the description for Test Event 4.',
          over18: false,
          over21: false,
          membersonly: true,
          category: 'club',
          attendees: 5
        },
        {
          eventid: '00000000-0003-0000-0000-000000000000',
          eventname: 'Test Event 3',
          businessid: '20000000-0000-0000-0000-000000000000',
          starttime: '2021-05-03T13:30:00.000Z',
          endtime: '2021-05-03T16:00:00.000Z',
          capacity: 4,
          description: 'This is the description for Test Event 3. Test Event 3 has a longer description than the others.',
          over18: false,
          over21: false,
          membersonly: true,
          category: 'school',
          attendees: 4
        },
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
        },
        {
          eventid: '00000000-0001-0000-0000-000000000000',
          eventname: 'Test Event 1',
          businessid: '00000000-0000-0000-0000-000000000000',
          starttime: '2021-05-02T09:00:00.000Z',
          endtime: '2021-05-02T10:00:00.000Z',
          capacity: 5,
          description: 'This is the description for Test Event 1.',
          over18: false,
          over21: false,
          membersonly: true,
          category: 'gym',
          attendees: 2
        }
      ]);
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
      expect(data.body).toStrictEqual({
        eventid: '00000000-0019-0000-0000-000000000000',
        eventname: 'Wine Tasting',
        description: 'Temp Description',
        businessid: '00000000-0000-0000-0000-000000000000',
        starttime: '2021-09-15T23:30:00.000Z',
        endtime: '2021-09-16T02:30:00.000Z',
        capacity: 20,
        repeatid: null,
        membersonly: false,
        over18: false,
        over21: true,
        category: null
      });
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

*/
test('event sign up successful', async () => {
  await request.put('api/events/00000000-0013-0000-0000-000000000000/signup')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(200);
})