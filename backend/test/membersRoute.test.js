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
      const expected = [{
        businessid: expect.any(String),
        businessname: expect.any(String),
        email: expect.any(String),
        phonenumber: expect.any(String),
        description: expect.any(String)
      }];
      expect(data.body).toEqual(expect.arrayContaining(expected));
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