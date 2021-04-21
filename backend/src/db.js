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
// Returns the newly created event eventid
exports.insertEvent = async (eventname, starttime, endtime, businessid, capacity=100) => {
  const insert = 'INSERT INTO Events (eventname, starttime, endtime, businessid, capacity) VALUES ($1, $2, $3, $4, $5) RETURNING eventid';
  const query = {
    text: insert,
    values: [eventname, starttime, endtime, businessid, capacity],
  };

  const {rows} = await pool.query(query);
  return rows[0].eventid;
};

exports.insertBusinessAccount = async (businessname, password, phonenumber, businessemail) => {
  const insert = 'INSERT INTO Businesses (businessname, Password, phonenumber, businessemail) VALUES ($1, $2, $3, $4) RETURNING businessid';
  const query = {
    text: insert,
    values: [businessname, password, phonenumber, businessemail],
  };

  const {rows} = await pool.query(query);
  return rows[0].businessid;
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


exports.getEventByID = async (eventid) => {
  const queryText = 'SELECT * FROM Events e WHERE e.eventid = $1';
  const query = {
    text: queryText,
    values: [eventid],
  };

  const {rows} = await pool.query(query);
  return rows[0];
}

exports.getEventsByStart = async (starttime) => {
  const queryText = 'SELECT * FROM Events e WHERE e.starttime >= $1';
  const query = {
    text: queryText,
    values: [starttime],
  };

  const {rows} = await pool.query(query);
  return rows;
}

exports.getEventsByEnd = async (endtime) => {
  const queryText = 'SELECT * FROM Events e WHERE e.endtime <= $1';
  const query = {
    text: queryText,
    values: [endtime],
  };

  const {rows} = await pool.query(query);
  return rows;
}


exports.getEventsByRange = async (starttime, endtime) => { // start time must be a unix timestamp
  const queryText = 'SELECT * FROM Events e WHERE e.starttime >= $1 AND e.endtime <= $2';
  const query = {
    text: queryText,
    values: [starttime, endtime],
  };

  const {rows} = await pool.query(query);
  return rows;
}

exports.insertAttendees = async (eventid, userid) => {
  const insert = 'INSERT INTO Attendees (eventid, userid) SELECT ($1, $2) FROM Attendees a, Events e WHERE a.eventid = $1 HAVING count(*) < e.capacity';
  const query = {
    text: insert,
    values: [eventid, userid],
  };

  const {rows} = await pool.query(query);
  return rows;
};


exports.insertUserAccount = async (username, password, email) => {
  const insert = 'INSERT INTO Users (username, password, useremail) VALUES ($1, $2, $3) RETURNING userid';
  const query = {
    text: insert,
    values: [username, password, email],
  };

  const {rows} = await pool.query(query);
  return rows[0].userid;
};

// Returns row for a specific userid
exports.selectUser = async (userid) => {
  const select = 'SELECT * FROM Users WHERE userid = $1';
  const query = {
    text: select,
    values: [userid],
  };

  const {rows} = await pool.query(query);
  return rows[0];
};

// check if an email is already in use
exports.checkUserEmailTaken = async (email) => {
  const insert = 'SELECT * FROM Users u WHERE u.useremail = $1';
  const query = {
    text: insert,
    values: [email],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0 ? rows[0] : undefined);
}

// get a user hashed password
exports.getUserPass = async (email) => {
  const insert = 'SELECT password FROM Users u WHERE u.useremail = $1';
  const query = {
    text: insert,
    values: [email],
  };

  const {rows} = await pool.query(query);
  return rows[0].password;
}

// check if a business email is already in use
exports.checkBusinessEmailTaken = async (email) => {
  const insert = 'SELECT * FROM Businesses b WHERE b.businessemail = $1';
  const query = {
    text: insert,
    values: [email],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0 ? rows[0] : undefined);
}

// get a business hashed password
exports.getBusinessPass = async (email) => {
  const insert = 'SELECT password FROM Businesses b WHERE b.businessemail = $1';
  const query = {
    text: insert,
    values: [email],
  };

  const {rows} = await pool.query(query);
  return rows[0].password;
}

exports.getUsersEvents = async (userid) => {
  const queryText = 'SELECT e.eventid FROM Events e, Attendees a WHERE a.userid = $1 AND e.userid = $1';
  const query = {
    text: queryText,
    values: [userid],
  };

  const {rows} = await pool.query(query);
  return rows;
};

exports.checkUserAttending = async (eventid, userid) => {
  const select = 'SELECT * FROM Attendees a WHERE a.eventid = $1 AND a.userid = $2';
  const query = {
    text: select,
    values: [eventid, userid],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0);
}


console.log(`Connected to database '${process.env.DB}'`);
