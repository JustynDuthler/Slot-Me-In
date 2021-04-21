require('dotenv').config();
const app = require('./app.js');

app.listen(3010, () => {
  console.log(`Server Running on port 3010`);
  console.log('API Testing UI: http://localhost:3010/v0/api-docs/');
});
