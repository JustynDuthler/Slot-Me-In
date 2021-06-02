const supertest = require('supertest');
const http = require('http');
const app = require('../src/app');
const { send } = require('process');

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
---------------------------signup tests------------------------------------

  1. successful new business account signup (201)
  2. unsuccessful account signup, name already taken (409)

*/
test('New Business Account Signup Successful Test', async() => {
  await request.post('/api/businesses/signup')
    .send({
      name: 'SlotMeIn',
      email: 'slotmein@ucsc.edu',
      password: 'slotmeinPass',
      phonenumber: '123-456-7890',
      description: 'Slot Me In website'
    })
    .expect(201)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = {
        auth_token: expect.any(String),
      };
      expect(data.body).toEqual(expect.objectContaining(expected));
    })
})

test('New Business Account Signup, Name Already Taken Test', async() => {
  await request.post('/api/businesses/signup')
    .send({
      name: 'SlotMeIn',
      email: 'slotmein@ucsc.edu',
      password: 'slotmeinPass',
      phonenumber: '123-456-7890',
      description: 'Slot Me In website'
    })
    .expect(409)
})

/*
---------------------------login tests------------------------------------

  1. successful login (200)
  2. email not found (404)
  3. incorrect password (401)

*/
test('Successful Login Test', async() => {
  await request.post('/api/businesses/login')
    .send({
      email: 'contact@google.com',
      password: 'password'
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = {
        auth_token: expect.any(String),
      };
      expect(data.body).toEqual(expect.objectContaining(expected));
    })
})

test('Email Not Login Test', async() => {
  await request.post('/api/businesses/login')
    .send({
      email: 'notFound@Account.com',
      password: 'password'
    })
    .expect(404)
})

test('Incorrect Password Login Test', async() => {
  await request.post('/api/businesses/login')
    .send({
      email: 'contact@google.com',
      password: 'badPassWord'
    })
    .expect(401)
})

/*
---------------------------getBusiness tests------------------------------------

  1. gets a valid businesses information (200)
  2. invalid token type (403)
  3. bad token (401)

*/
test('Get Valid Businesses Information Test', async() => {
  await request.get('/api/businesses/getBusiness')
    .set({'Authorization': 'Bearer ' + businessAuthToken})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = {
        businessid: expect.any(String),
        businessname: expect.any(String),
        email: expect.any(String),
        phonenumber: expect.any(String),
        description: expect.any(String)
      }
      expect(data.body).toEqual(expect.objectContaining(expected));
    })

})

test('Get Business User Token Test', async() => {
  await request.get('/api/businesses/getBusiness')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(403)
})

test('Get Business Bad Token Test', async() => {
  await request.get('/api/businesses/getBusiness')
    .set({'Authorization': 'Bearer ' + 'dfgh3456fgh'})
    .expect(401)
})

/*
---------------------------getBusinessEvents tests------------------------------------

  1. gets a businesses events (200)
  2. invalid token type (403)
  3. bad token (401)

*/
test('Get a Businesses Events Test', async() => {
  await request.get('/api/businesses/getBusinessEvents')
    .set({'Authorization': 'Bearer ' + businessAuthToken})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = [
        {
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
        }]
        expect(data.body).toEqual(expect.arrayContaining(expected));
    })

})

test('Get Businesses Events User Token Test', async() => {
  await request.get('/api/businesses/getBusinessEvents')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(403)
})

test('Get Businesses Events Bad Token Test', async() => {
  await request.get('/api/businesses/getBusinessEvents')
    .set({'Authorization': 'Bearer ' + 'dfgh3456fgh'})
    .expect(401)
})

/*
---------------------------{businessid}/events tests------------------------------------

  1. Gets a businesses events (200)
  2. Business id is not found (404)

*/
test('Get a Businesses Events With ID Test', async() => {
  await request.get('/api/businesses/10000000-0000-0000-0000-000000000000/events')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = [
        {
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
        }]
        expect(data.body).toEqual(expect.arrayContaining(expected));
    })

})

test('Get Businesses Events With Unspecified ID Test', async() => {
  await request.get('/api/businesses/12300000-0000-0000-0000-000000000000/events')
    .expect(404)
})

/*
---------------------------checkBusinessID tests------------------------------------

  1. Given token is a valid ID (200)
  2. Invalid token given (403)
  3. Bad token (401)

*/
test('Check Valid Business Token Test', async() => {
  await request.get('/api/businesses/checkBusinessID')
    .set({'Authorization': 'Bearer ' + businessAuthToken})
    .expect(200)
})

test('Check Invalid Business Token Test', async() => {
  await request.get('/api/businesses/checkBusinessID')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(403)
})

test('Check bad Business Token Test', async() => {
  await request.get('/api/businesses/checkBusinessID')
    .set({'Authorization': 'Bearer ' + 'fghj34567sdfg'})
    .expect(401)
})

/*
---------------------------Get Business By ID tests------------------------------------

  1. Given token is a valid ID (200)
  2. Invalid token given (404)

*/
test('Get Business By ID Test', async() => {
  await request.get('/api/businesses/10000000-0000-0000-0000-000000000000')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      const expected = {
        businessid: expect.any(String),
        businessname: expect.any(String),
        email: expect.any(String),
        phonenumber: expect.any(String),
        description: expect.any(String)
      }
      expect(data.body).toEqual(expect.objectContaining(expected));
    })
})

test('Get Business By Not Found ID Test', async() => {
  await request.get('/api/businesses/10000000-0000-0000-9999-000000000000')
    .expect(404)
})

/*
---------------------------Businesses get tests------------------------------------

  1. successful retreival of all businesses (200)
  
  cannot run 404 as database is full of businesses

*/
test('Get All Businesses Information Test', async() => {
  await request.get('/api/businesses/')
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
      }]
      expect(data.body).toEqual(expect.arrayContaining(expected));
    })
})

/*
---------------------------uploadProfileImage tests------------------------------------

  1. successful image upload (200) (Through Swagger UI, Dont want to dump 10MB strings in testing)
  2. Invalid File type (400)       (Trhough Swagger UI, Dont want to dump 10MB strings in testing)

/*
---------------------------getProfileImage tests------------------------------------

  1. successfully get image (201)
  3. User token (403)
  4. Bad token (401)

*/
test('Get Profile Image Test', async() => {
  await request.get('/api/businesses/getProfileImage')
    .set({'Authorization': 'Bearer ' + businessAuthToken})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body).toEqual(expect.any(String));
    })
})

test('Get Profile Image User Token Test', async() => {
  await request.get('/api/businesses/getProfileImage')
    .set({'Authorization': 'Bearer ' + userAuthToken})
    .expect(403)
})

test('Get Profile Image User Token Test', async() => {
  await request.get('/api/businesses/getProfileImage')
    .set({'Authorization': 'Bearer ' + 'fghj34567sdfg'})
    .expect(401)
})
