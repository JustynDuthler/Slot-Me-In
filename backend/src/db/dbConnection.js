// Database connection File
const dotenv = require('dotenv');
dotenv.config();

const {Pool} = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

pool.connect();
module.exports = pool;
console.log(`Connected to database '${process.env.DB}'`);
