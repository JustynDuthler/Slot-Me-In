const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const jwt = require('jsonwebtoken');


const auth = require('./auth');
const users = require('./users');
const businesses = require('./businesses');
const events = require('./events');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
  );
  
// User routes
app.post('/api/users/login', users.login);
app.post('/api/users/signup', users.signup);
app.get('/api/users/:userID/events', users.getEvents);
app.get('/api/users/getUser', auth.authenticateJWT, users.getInfo);

// Business routes
app.post('/api/businesses/login', businesses.login);
app.post('/api/businesses/signup', businesses.signup);
app.get('/api/businesses/:businessID/events', businesses.getEvents);
// Event routes
app.post('/api/events', events.create);
app.get('/api/events', events.getEvents);
app.get('/api/events/:eventID', events.getEventByID);
app.put('/api/events/:eventID/signup', events.signup)

// Generates a token which expires in 1 minute
app.get('/api/test/get_token', async (req, res) => {
  temp_token = await auth.generateJWT('jeff@ucsc.edu', '00000000-0000-0000-0000-000000000000', 'user');
  res.status(200).json({auth_token: temp_token});
});

// A test api which uses authentication middleware
// Will send the json only if the middleware authenticates the JWT
app.post('/api/test/test_token', auth.authenticateJWT, (req, res) => {
  res.status(200).json({auth: "authenticated"});
});

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

app.get('/db/test', async(req, res) => {
  let eventID = '00000000-0000-0000-0000-000000000010';
  db.getEventByID(eventID);
  res.status(200);
})

module.exports = app;
