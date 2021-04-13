// Database connection File
const dotenv = require('dotenv');
dotenv.config();

const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

pool.connect()

// basic testing query
exports.dbTest = async() => {
    pool.query('SELECT * FROM USERS', (err, res) => {
        console.log(err, res);
        pool.end;
    });
};

// Inserts a new event entry into the database
// Returns the newly created event eventID
exports.insertEvent = async (eventName, startTime, endTime, date, businessID, capacity=null) => {
  const insert = 'INSERT INTO Events (eventName, startTime, endTime, date, businessID, capacity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING eventID';
  const query = {
    text: insert,
    values: [eventName, startTime, endTime, date, businessID, capacity],
  };
  
  const {rows} = await pool.query(query);
  return rows[0].eventID;
};

exports.insertBusinessAccount = async (businessName, password, phoneNumber, businessEmail) => {
  const insert = 'INSERT INTO Businesses (businessName, Password, phoneNumber, businessEmail) VALUES ($1, $2, $3, $4) RETURNING businessID';
  const query = {
    text: insert,
    values: [businessName, password, phoneNumber, businessEmail],
  };

  const {rows} = await pool.query(query);
  return rows[0].businessID;
};


console.log(`Connected to database '${process.env.DB}'`);