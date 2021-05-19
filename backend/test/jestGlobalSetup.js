const db = require('./db');
const supertest = require('supertest');
const http = require('http');
const app = require('../src/app');

let server;

global.beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  console.log("HERE");
});
