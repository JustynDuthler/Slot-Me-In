const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const jwt = require('jsonwebtoken');


const users = require('./users');
const businesses = require('./businesses');
const auth = require('./auth');

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
  
// User authentication routes
app.post('/api/users/login', users.login);
app.post('/api/users/signup', users.signup);
// Business authentication routes
app.post('/api/businesses/login', businesses.login);
app.post('/api/businesses/signup', businesses.signup);

// Generates a token which expires in 1 minutes
app.get('/api/test/get_token', async (req, res) => {
  temp_token = jwt.sign({data: "asdfasdf"}, process.env.TOKEN_SECRET, {expiresIn: '60s'});
  res.status(200).json({token: temp_token});
});

app.post('/api/test/test_token', auth, (req, res) => {
  res.status(200).json({auth: "authenticated"});
});

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;