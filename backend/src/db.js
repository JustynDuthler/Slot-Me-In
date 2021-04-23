// Database connection File
const dotenv = require('dotenv');
dotenv.config();

const { Pool } = require('pg');

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
exports.insertEvent = async (eventname, starttime, endtime, businessid, capacity=100, description) => {
  const insert = 'INSERT INTO Events (eventname, starttime, endtime, businessid, capacity, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING eventid';
  const query = {
    text: insert,
    values: [eventname, starttime, endtime, businessid, capacity, description],
  };

  const {rows} = await pool.query(query);
  return rows[0].eventid;
};

exports.deleteEvent = async (eventid) => {
  const del = 'DELETE FROM Events WHERE eventid = $1';
  const query = {
    text: del,
    values: [eventid],
  };

  const {rows} = await pool.query(query);
  return rows;
}

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

exports.checkRemainingEventCapacity = async (eventid) => {
  const insert = 'SELECT * FROM Attendees a WHERE a.eventid = $1';
  const query = {
    text: insert,
    values: [eventid],
  };

  const {rows} = await pool.query(query);
  return rows;
}

exports.insertAttendees = async (eventid, userid) => {
  const insert = 'INSERT INTO Attendees (eventid, userid) VALUES ($1, $2)';
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

// Returns row for a specific businessid
exports.selectBusiness = async (businessid) => {
  const select = 'SELECT * FROM Businesses WHERE businessid = $1';
  const query = {
    text: select,
    values: [businessid],
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

// returns list of events for which userid is attending, had to join so that I could get the business name
exports.getUsersEvents = async (userid) => {
  const queryText =
    'SELECT eventid, eventname, events.businessid, starttime, endtime, capacity, businessname ' + // Gets relevant information
      'FROM Events INNER JOIN Businesses ON Events.businessid = Businesses.businessid ' + // Join the events and business table where businessid is the same
        'WHERE eventid IN (SELECT eventid FROM attendees where userid = $1)'; // Matches events with the event id from attending when userid is the one given
  const query = {
    text: queryText,
    values: [userid],
  };

  const {rows} = await pool.query(query);
  return rows;
};
// returns list of events created by businessid
exports.getBusinessEvents = async (businessid) => {
  const queryText = 'SELECT * FROM Events e WHERE e.businessid = $1';
  const query = {
    text: queryText,
    values: [businessid],
  };

  const {rows} = await pool.query(query);
  return rows;
}

exports.checkUserAttending = async (eventid, userid) => {
  const select = 'SELECT * FROM Attendees a WHERE a.eventid = $1 AND a.userid = $2';
  const query = {
    text: select,
    values: [eventid, userid],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0);
}

// Removes user from the attendees table
exports.removeUserAttending = async (eventid, userid) => {
  const deleteU = 'DELETE FROM Attendees a WHERE a.userid = $1 AND a.eventid = $2 RETURNING a.eventid';
  const query = {
    text: deleteU,
    values: [userid, eventid],
  }

  const {rows} = await pool.query(query);
  return (rows.length);

}

console.log(`Connected to database '${process.env.DB}'`);
