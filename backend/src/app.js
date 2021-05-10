const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const auth = require('./auth');
const users = require('./routes/users');
const businesses = require('./routes/businesses');
const events = require('./routes/events');
const attendees = require('./routes/attendees');
const members = require('./routes/members');
const db = require('./db/db');

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
// incomplete, use getUserEvents
// app.get('/api/users/:userid/events', users.getEvents);
app.get('/api/users/getUser', auth.userAuth, users.getInfo);
app.get('/api/users/getUserEvents', auth.userAuth, users.getEvents);
app.delete('/api/users/removeUserAttending',
    auth.userAuth, users.removeUserAttending);

// Business routes
app.post('/api/businesses/login', businesses.login);
app.post('/api/businesses/signup', businesses.signup);
// incomplete, pass businessid via token instead
// app.get('/api/businesses/:businessid/events', businesses.getEvents);
app.get('/api/businesses/getBusiness', 
  auth.businessAuth, businesses.getInfo);
app.get('/api/businesses/getBusinessEvents', 
  auth.businessAuth, businesses.getEvents);
app.get('/api/businesses/checkBusinessID', 
  auth.businessAuth, businesses.validID);
app.get('/api/businesses/:businessid', businesses.getBusinessByID);
app.post('/api/businesses/uploadProfileImage', auth.businessAuth, businesses.saveProfileImage);

// Event routes
app.post('/api/events', auth.businessAuth, events.create);

/* I made this require a token so that I can determine whether to return all
events or just events by the business depending on if the account is a business
or user account
*/
app.get('/api/events', auth.authenticateJWT, events.getEvents);
app.get('/api/events/publicEvents', events.getPublicEvents);
app.get('/api/events/:eventid', events.getEventByID);
app.delete('/api/events/:eventid', auth.businessAuth, events.delete);
app.put('/api/events/:eventid/signup', auth.userAuth, events.signup);

// Attendees routes
app.get('/api/attendees/:eventid', attendees.getTotalAttendees);

// Members routes
app.post('/api/members/insertMembers',
    auth.businessAuth, members.addMembers);
app.get('/api/members/getMembers', auth.businessAuth,
    members.getMembers);
app.delete('/api/members/deleteMember', auth.businessAuth,
    members.deleteMember);

// Generates a token which expires in 1 minute
app.get('/api/test/get_token', async (req, res) => {
  tempToken = await auth.generateJWT(
      'jeff@ucsc.edu', '00000000-0000-0000-0000-000000000000', 'user');
  res.status(200).json({auth_token: tempToken});
});

// A test api which uses authentication middleware
// Will send the json only if the middleware authenticates the JWT
app.post('/api/test/test_token', auth.authenticateJWT, (req, res) => {
  res.status(200).json({auth: 'authenticated'});
});

// returns the type of the token, 200 if the token is valid.
app.get('/api/test/get_token_type', auth.authenticateJWT, auth.tokenType);


app.use((err, req, res, next) => {
  console.error(err.stack);
  // console.log(res);
  // console.log(next);
  res.status(err.status).send('Internal Server Error');
});
module.exports = app;
