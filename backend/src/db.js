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
exports.insertEvent = async (eventname, starttime, endtime, businessid, capacity=100, description, repeatid=null) => {
  const insert = 'INSERT INTO Events (eventname, starttime, endtime, businessid, capacity, description, repeatid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING eventid';
  const query = {
    text: insert,
    values: [eventname, starttime, endtime, businessid, capacity, description, repeatid],
  };

  const {rows} = await pool.query(query);
  return rows[0].eventid;
};

exports.insertRepeatingEvent = async (eventname, description, businessid, starttime, endtime, capacity,
                                      sunday, monday, tuesday, wednesday, thursday, friday, saturday,
                                      repeattype='w', repeatend) => {
  const insert = 'INSERT INTO RepeatingEvents (eventname, description, businessid, starttime, endtime, capacity, sunday, monday, tuesday, wednesday, thursday, friday, saturday, repeattype, repeatend) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING repeatid';
  const query = {
    text: insert,
    values: [eventname, description, businessid, starttime, endtime, capacity,
            sunday, monday, tuesday, wednesday, thursday, friday ,saturday,
            repeattype, repeatend],
  };

  const {rows} = await pool.query(query);
  return rows[0].repeatid;
};

exports.deleteEvent = async (eventid) => {
  const del = 'DELETE FROM Events WHERE eventid = $1';
  const query = {
    text: del,
    values: [eventid],
  };

  const {rows} = await pool.query(query);
  return rows;
};

exports.deleteRepeatingEvent = async (repeatid) => {
  const del = 'DELETE FROM RepeatingEvents WHERE repeatid = $1';
  const query = {
    text: del,
    values: [repeatid],
  };

  const {rows} = await pool.query(query);
  return rows;
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
  const select =
  'SELECT e.eventid, e.eventname, e.businessid, e.starttime, r.starttime as repeatstart, e.endtime, e.capacity, e.description,'+
    'monday,tuesday,wednesday,thursday,friday,saturday,sunday,r.repeattype,r.repeatend,e.repeatid '+
      'FROM (Events e LEFT JOIN RepeatingEvents r ON e.repeatid = r.repeatid)';
  const query = {
    text: select,
    values: [],
  };
  const days = {'sunday':0,'monday':1,'tuesday':2,'wednesday':3,'thursday':4,'friday':5,'saturday':6};
  const {rows} = await pool.query(query);
  const rows2 = [];
  for (let i in rows) {
    let row = {};
    let row_days = {};
    for (let j in rows[i]) {
      if (rows[i][j] === null) {continue;}
      if (j in days) {row_days[j] = rows[i][j];}
      else {row[j] = rows[i][j];}
    }
    if (rows[i]["repeatid"] !== null) {
      row["repeatdays"] = row_days;
    }
    rows2.push(row);
  }
  return rows2;
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
    'SELECT e.eventid, e.description, e.eventname, e.businessid, e.starttime, r.starttime as repeatstart, e.endtime, e.capacity, Businesses.businessname, ' + // Gets relevant information
      'monday,tuesday,wednesday,thursday,friday,saturday,sunday,r.repeattype,r.repeatend,e.repeatid '+
      'FROM Events e INNER JOIN Businesses ON e.businessid = Businesses.businessid ' + // Join the events and business table where businessid is the same
        'LEFT JOIN RepeatingEvents r ON e.repeatid = r.repeatid ' +
        'WHERE e.eventid IN (SELECT eventid FROM attendees where userid = $1)'; // Matches events with the event id from attending when userid is the one given
  const query = {
    text: queryText,
    values: [userid],
  };

  const days = {'sunday':0,'monday':1,'tuesday':2,'wednesday':3,'thursday':4,'friday':5,'saturday':6};
  const {rows} = await pool.query(query);
  const rows2 = [];
  for (let i in rows) {
    let row = {};
    let row_days = {};
    for (let j in rows[i]) {
      if (rows[i][j] === null) {continue;}
      if (j in days) {row_days[j] = rows[i][j];}
      else {row[j] = rows[i][j];}
    }
    if (rows[i]["repeatid"] !== null) {
      row["repeatdays"] = row_days;
    }
    rows2.push(row);
  }
  return rows2;
};
// returns list of events created by businessid
exports.getBusinessEvents = async (businessid) => {
  const queryText =
  'SELECT e.eventid, e.eventname, e.businessid, e.starttime, r.starttime as repeatstart, e.endtime, e.capacity, e.description,'+
    'monday,tuesday,wednesday,thursday,friday,saturday,sunday,r.repeattype,r.repeatend,e.repeatid '+
      'FROM (Events e LEFT JOIN RepeatingEvents r ON e.repeatid = r.repeatid) WHERE e.businessid = $1';
  const query = {
    text: queryText,
    values: [businessid],
  };
  const days = {'sunday':0,'monday':1,'tuesday':2,'wednesday':3,'thursday':4,'friday':5,'saturday':6};
  const {rows} = await pool.query(query);
  const rows2 = [];
  for (let i in rows) {
    let row = {};
    let row_days = {};
    for (let j in rows[i]) {
      if (rows[i][j] === null) {continue;}
      if (j in days) {row_days[j] = rows[i][j];}
      else {row[j] = rows[i][j];}
    }
    if (rows[i]["repeatid"] !== null) {
      row["repeatdays"] = row_days;
    }
    rows2.push(row);
  }
  return rows2;
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

exports.getUserIDByEmail = async (useremail) => {
  const select = 'SELECT u.userid FROM Users u WHERE u.useremail = $1';
  const query = {
    text: select,
    values: [useremail],
  }

  const {rows} = await pool.query(query);
  return (rows.length > 0 ? rows[0].userid : null);
}

exports.insertMembers = async (memberlist) => {
  const insert = 'INSERT INTO Members(businessid, memberemail, userid) VALUES ' + memberlist + ' RETURNING userid';
  const query = {
    text: insert,
  }

  const {rows} = await pool.query(query);
  return (rows.length);
}

// removes user from members table
exports.removeMember = async (buisnessid, userid) => {
  const deleteM = 'DELETE FROM Members m WHERE m.buisnessid = $1 AND m.userid = $2 RETURNING m.userid';
  const query = {
    text: deleteM,
    values: [buisnessid, userid],
  }

  const {rows} = await pool.query(query);
  return (rows.length);
}

/* for the moment we will use this function to remove a user from events after they are removed from
*  the members table. In order to cascade in the db we must indicate if the event is for users only,
*  so we can change that but for a demo we can use this
*/
exports.removeMemberFromAttendees = async (buisnessid, userid) => {
  // select all eventids for the business and remove the user from the attendees table
  const deleteM = 'DELETE FROM Attendees a WHERE a.userid = $2 AND a.eventid IN (SELECT e.eventid \
                   FROM Events e WHERE e.businessid = $1) RETURNING *'; // return rows deleted
  const query = {
    text: deleteM,
    values: [buisnessid, userid],
  }

  const {rows} = await pool.query(query);
  return (rows.length);
}

exports.getMembersForBusiness = async (buisnessid) => {
  const select = 'SELECT m.userid FROM Members m WHERE m.businessid = $1';
  const query = {
    text: select,
    values: [buisnessid],
  }

  const {rows} = await pool.query(query);
  return (rows.length > 0 ? rows : undefined);
}

exports.getMemberUserInfo = async (useridlist) => {
  const select = 'SELECT u.userid, u.username, u.useremail FROM Users u WHERE (u.userid) IN ( VALUES ' + useridlist + ')';
  const query = {
    text: select,
  }

  const {rows} = await pool.query(query);
  return (rows);
}
console.log(`Connected to database '${process.env.DB}'`);
