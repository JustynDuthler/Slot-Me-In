const supertest = require('supertest');
const http = require('http');
const app = require('../src/app');

let server;
let businessAuthToken;

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

/*
---------------------------getMember tests------------------------------------

  1. normal get members
  2. Bad token

*/
test('Get Members', async () => {
  await request.get('/api/members/getMembers')
    .set({'Authorization': 'Bearer ' + businessAuthToken})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    })
})

test('Get Members with bad token', async () => {
  await request.get('/api/members/getMembers')
  .set({'Authorization': 'Bearer ' + '23456dfgh45tyusdfg45t'})
  .expect(401)
})

/*
----------------------getMemberBusinesses tests--------------------------------

  1. user will businesses
  2. user with no businesses
  3. bad email

*/
test('Get Memeber Businesses Test with businesses', async () => {
  await request.get('/api/members/getMemberBusinesses/jeff@ucsc.edu')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body).toStrictEqual([
        {
          businessid: '10000000-0000-0000-0000-000000000000',
          businessname: 'Google',
          email: 'contact@google.com',
          phonenumber: '000-000-0001',
          description: ''
        },
        {
          "businessid": "20000000-0000-0000-0000-000000000000",
          "businessname": "Amazon",
          "email": "contact@amazon.com",
          "phonenumber": "000-000-0002",
          "description": ""
        },
        {
          "businessid": "90000000-0000-0000-0000-000000000000",
          "businessname": "Microsoft",
          "description": "",
          "email": "contact@microsoft.com",
          "phonenumber": "000-000-0009",
        },
      ]);
    })
})

test('Get Memeber Businesses Test with no businesses', async () => {
  await request.get('/api/members/getMemberBusinesses/rosa@ucsc.edu')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body).toStrictEqual([]);
    })
})

test('Get Memeber Businesses Test with no businesses', async () => {
  await request.get('/api/members/getMemberBusinesses/h')
    .expect(400)
})

/*
----------------------getRestrictedEvents tests--------------------------------

  1. user with a membership with restricted events
  2. user with a membership and no restricted events
  3. bad email
*/
test('Get member restrcited events with restricted events', async () => {
  await request.get('/api/members/getRestrictedEvents/jeff@ucsc.edu')
  .expect(200)
  .expect('Content-Type', /json/)
  .then(data => {
    expect(data).toBeDefined();
    expect(data.body).toBeDefined();
    expect(data.body).toStrictEqual(
      [
        {
          eventid: '00000000-0002-0000-0000-000000000000',
          eventname: 'Test Event 2',
          description: '',
          businessid: '10000000-0000-0000-0000-000000000000',
          starttime: '2021-05-02T10:30:00.000Z',
          endtime: '2021-05-02T12:30:00.000Z',
          capacity: 10,
          repeatid: null,
          membersonly: true,
          over18: true,
          over21: false,
          category: 'party',
          attendees: 3
        },
        {
          eventid: '00000000-0003-0000-0000-000000000000',
          eventname: 'Test Event 3',
          description: 'This is the description for Test Event 3. Test Event 3 has a longer description than the others.',
          businessid: '20000000-0000-0000-0000-000000000000',
          starttime: '2021-05-03T13:30:00.000Z',
          endtime: '2021-05-03T16:00:00.000Z',
          capacity: 4,
          repeatid: null,
          membersonly: true,
          over18: false,
          over21: false,
          category: 'school',
          attendees: 4
        },
        {
          eventid: '00000000-0010-0000-0000-000000000000',
          eventname: 'Test Event 10',
          description: 'This is the description for Test Event 10.',
          businessid: '90000000-0000-0000-0000-000000000000',
          starttime: '2021-09-07T13:30:00.000Z',
          endtime: '2021-09-07T15:00:00.000Z',
          capacity: 45,
          repeatid: null,
          membersonly: true,
          over18: false,
          over21: false,
          category: null,
          attendees: 1
        },
        {
          eventid: '00000000-0011-0000-0000-000000000000',
          eventname: 'Test Event 11',
          description: 'This is the description for Test Event 1.',
          businessid: '90000000-0000-0000-0000-000000000000',
          starttime: '2021-10-07T13:30:00.000Z',
          endtime: '2021-10-07T15:00:00.000Z',
          capacity: 50,
          repeatid: null,
          membersonly: true,
          over18: false,
          over21: false,
          category: null,
          attendees: 0
        }
      ])
  })
})

test('Get member restrcited events with no restricted events', async () => {
  await request.get('/api/members/getRestrictedEvents/katie@ucsc.edu')
  .expect(200)
  .expect('Content-Type', /json/)
  .then(data => {
    expect(data).toBeDefined();
    expect(data.body).toBeDefined();
    expect(data.body).toStrictEqual([]);
  })
})

test('Get member restrcited events with bad email', async () => {
  await request.get('/api/members/getRestrictedEvents/k')
  .expect(400)
})

/*
----------------------addMembers tests--------------------------------

  1. adds 3 members (2 non users, 1 already a user) 
  2. adds existing member
  3. bad business token
*/
test('Adding members to a business', async () => {
  await request.post('/api/members/insertMembers')
  .set({'Authorization': 'Bearer ' + businessAuthToken})
  .send(['daniel@mclaren.com','max@redbull', 'kai@ucsc.edu'])
  .expect(200)
  .expect('Content-Type', /json/)
  .then(data => {
    expect(data).toBeDefined();
    expect(data.body).toBeDefined();
    expect(data.body).toStrictEqual(      [
        { username: null, email: 'daniel@mclaren.com', userid: null },
        { username: null, email: 'max@redbull', userid: null },
        {
          username: 'Kai',
          email: 'kai@ucsc.edu',
          userid: '00000000-0000-0000-0000-000000000011'
        }
      ]);
  })
})

test('Adding member that already is a member', async () => {
  await request.post('/api/members/insertMembers')
  .set({'Authorization': 'Bearer ' + businessAuthToken})
  .send(['jeff@ucsc.edu'])
  .expect(200)
})

test('Adding member that already is a member', async () => {
  await request.post('/api/members/insertMembers')
  .set({'Authorization': 'Bearer ' + 'sedrfgvbhnj23e4r5t6y7u8'})
  .send(['jeff@ucsc.edu'])
  .expect(401)
})

/*
----------------------removeMembers tests--------------------------------

  1. removes a member
  2. removes non member
  3. bad business token

*/
test('removing a member from a business', async () => {
  await request.delete('/api/members/deleteMember')
  .set({'Authorization': 'Bearer ' + businessAuthToken})
  .send({'email': 'daniel@mclaren.com'})
  .expect(200)
  .expect('Content-Type', /json/)
  .then(data => {
    expect(data).toBeDefined();
    expect(data.body).toBeDefined();
    expect(data.body).toStrictEqual(
      { username: null, email: 'daniel@mclaren.com', userid: null }
    );
  })
})
/* should be a 401 but is 500 because of bad database businessid */
test('removing a non member from a business', async () => {
  await request.delete('/api/members/deleteMember')
  .set({'Authorization': 'Bearer ' + 'asdfghjk234567dfghj'})
  .send({'email': 'micheal@ferrari.com'})
  .expect(401)
})