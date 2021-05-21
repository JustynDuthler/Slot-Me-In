const supertest = require('supertest');
const http = require('http');
const app = require('../src/app');

let server;
let businessAuthToken;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  console.log("HERE");
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

  1. business with members

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

/*
----------------------getMemberBusinesses tests--------------------------------

  1. user will businesses
  2. user with no businesses

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
        }
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

/*
----------------------getRestrictedEvents tests--------------------------------

  1. user with a membership with restricted events
  2. user wi
*/