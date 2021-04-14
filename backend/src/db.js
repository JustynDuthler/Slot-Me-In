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
// module.exports = pool;
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
exports.insertEvent = async (eventName, startTime, endTime, businessID, capacity=100) => {
  const insert = 'INSERT INTO Events (eventName, startTime, endTime, businessID, capacity) VALUES ($1, $2, $3, $4, $5) RETURNING eventID';
  const query = {
    text: insert,
    values: [eventName, startTime, endTime, businessID, capacity],
  };

  const {rows} = await pool.query(query);
  return rows[0].eventid;
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

exports.getEvents = async () => {
  const select = 'SELECT * FROM Events';
  const query = {
    text: select,
    values: [],
  };

  const {rows} = await pool.query(query);
  return rows;
}


exports.getEventByID = async (eventID) => {
  const queryText = 'SELECT * FROM Events e WHERE e.eventID = $1';
  const query = {
    text: queryText,
    values: [eventID],
  };

  const {rows} = await pool.query(query);
  return rows[0];
}

exports.getEventsByStart = async (startTime) => { // start time must be a unix timestamp
  const queryText = 'SELECT * FROM Events e WHERE e.startTime = $1';
  const query = {
    text: queryText,
    values: [startTime],
  };

  const {rows} = await pool.query(query);
  return rows;
}

exports.insertAttendees = async (eventID, userID) => {
  const insert = 'INSERT INTO Attendees (eventID, userID) VALUES ($1, $2)';
  const query = {
    text: insert,
    values: [eventID, userID],
  };

  const {rows} = await pool.query(query);
  return rows;
};


exports.insertUserAccount = async (userName, password, email) => {
  const insert = 'INSERT INTO Users (userName, Password, userEmail) VALUES ($1, $2, $3) RETURNING userID';
  const query = {
    text: insert,
    values: [userName, password, email],
  };

  const {rows} = await pool.query(query);
  return rows[0].userID;
};

// Returns row for a specific userID
exports.selectUser = async (userid) => {
  const select = 'SELECT * FROM Users u WHERE u.userID = $1';
  const query = {
    text: select,
    values: [userid],
  };

  const {rows} = await pool.query(query);
  return rows[0];
};
// check if a username is taken
exports.checkUserNameTaken = async (userName) => {
  const insert = 'SELECT * FROM Users u WHERE u.userName = $1';
  const query = {
    text: insert,
    values: [userName],
  };

  const {rows} = await pool.query(query);
  return rows;
}

// check if an email is already in use
exports.checkUserEmailTaken = async (code, email) => {
  const insert = 'SELECT * FROM Users u WHERE u.userEmail = $1';
  const query = {
    text: insert,
    values: [email],
  };

  const {rows} = await pool.query(query);
  if (code === 1)
    return rows;
  else if (code === 2)
    return rows[0].password;
}

// check if a business username is taken
exports.checkBusinessNameTaken = async (businessName) => {
  const insert = 'SELECT * FROM Businesses b WHERE b.businessName = $1';
  const query = {
    text: insert,
    values: [businessName],
  };

  const {rows} = await pool.query(query);
  return rows;
}

// check if a business email is already in use
exports.checkBusinessEmailTaken = async (code, email) => {
  const insert = 'SELECT * FROM Businesses b WHERE b.businessEmail = $1';
  const query = {
    text: insert,
    values: [email],
  };

  const {rows} = await pool.query(query);
  if (code === 1)
    return rows;
  else if (code === 2)
    return rows[0].password;
}

exports.getUsersEvents = async (userID) => {
  const queryText = 'SELECT e.eventID FROM Events e, Attendees a WHERE a.userID = $1 AND e.userID = $1';
  const query = {
    text: queryText,
    values: [userID],
  };

  const {rows} = await pool.query(query);
  return rows;
};

console.log(`Connected to database '${process.env.DB}'`);
