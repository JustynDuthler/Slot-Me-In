const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const auth = require('./auth');
const users = require('./users');
const businesses = require('./businesses');
const events = require('./events');
const attendees = require('./attendees');
const members = require('./members');
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
//app.get('/api/users/:userid/events', users.getEvents); incomplete, use getUserEvents
app.get('/api/users/getUser', auth.authenticateUserJWT, users.getInfo);
app.get('/api/users/getUserEvents', auth.authenticateUserJWT, users.getEvents);
app.delete('/api/users/removeUserAttending', auth.authenticateUserJWT, users.removeUserAttending);

// Business routes
app.post('/api/businesses/login', businesses.login);
app.post('/api/businesses/signup', businesses.signup);
//app.get('/api/businesses/:businessid/events', businesses.getEvents); incomplete, pass businessid via token instead
app.get('/api/businesses/getBusiness', auth.authenticateBusinessJWT, businesses.getInfo);
app.get('/api/businesses/getBusinessEvents', auth.authenticateBusinessJWT, businesses.getEvents);
app.get('/api/businesses/checkBusinessID', auth.authenticateBusinessJWT, businesses.validID);
app.get('/api/businesses/:businessid', businesses.getBusinessByID)

// Event routes
app.post('/api/events', auth.authenticateBusinessJWT, events.create);
/* I made this require a token so that I can determine whether to return all
events or just events by the business depending on whether the account is a business
or user account
*/
app.get('/api/events', auth.authenticateJWT, events.getEvents);
app.get('/api/events/:eventid', events.getEventByID);
app.delete('/api/events/:eventid', auth.authenticateBusinessJWT, events.delete);
app.put('/api/events/:eventid/signup', auth.authenticateUserJWT, events.signup);

// Attendees routes
app.get('/api/attendees/:eventid', attendees.getTotalAttendees);

// Members routes
app.post('/api//members/insertMembers', auth.authenticateBusinessJWT, members.addMembers);

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

// simple database test
app.get('/db/test', async(req, res) => {
  let eventid = '00000000-0000-0000-0000-000000000010';
  db.getEventByID(eventid);
  res.status(200);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  //console.log(res);
  //console.log(next);
  res.status(err.status).send('Internal Server Error');
});
module.exports = app;
