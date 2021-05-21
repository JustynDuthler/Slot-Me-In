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

beforeEach(async () => {
  await request.get('/api/test/get_business_token')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      businessAuthToken = data.body.auth_token;
    })
})
/*------------------Members Testing-----------------------------*/

/*getMembers test*/
test('Get Members', async () => {
  await request.get('/api/members/getMembers')
    .set({'Authorization': 'Bearer ' + businessAuthToken})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      console.log(data);
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    })
})