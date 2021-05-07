const fs = require('fs');
const {Pool} = require('pg');

require('dotenv').config();
process.env.DB='test';

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const run = async (file) => {
  const content = fs.readFileSync(file, 'utf8');
  await pool.query(content);
  //const statements = content.split(/;/);
  //for (statement of statements) {
  //  await pool.query(statement);
  //}
};

exports.reset = async () => {
  await run('database/databaseImport.sql');
  await run('database/createTables.sql');
  await run('database/dummyData.sql');
  await run('database/indexes.sql');
};