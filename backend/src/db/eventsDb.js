const pool = require('./dbConnection');

// Inserts a new event entry into the database
// Returns the newly created event eventid
exports.insertEvent =
    async (eventname, starttime, endtime, businessid,
        capacity=100, description, repeatid=null) => {
      const insert = 'INSERT INTO Events ' +
          '(eventname, starttime, endtime, businessid, capacity, ' +
          'description, repeatid) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING eventid';
      const query = {
        text: insert,
        values: [eventname, starttime, endtime, businessid,
          capacity, description, repeatid],
      };

      const {rows} = await pool.query(query);
      return rows[0].eventid;
    };

exports.insertRepeatingEvent =
  async (eventname, description, businessid, starttime, endtime, capacity,
      sunday, monday, tuesday, wednesday, thursday, friday, saturday,
      repeattype='w', repeatend) => {
    const insert = 'INSERT INTO RepeatingEvents ' +
        '(eventname, description, businessid, starttime, endtime, ' +
        'capacity, sunday, monday, tuesday, wednesday, thursday, ' +
        'friday, saturday, repeattype, repeatend) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ' +
        '$11, $12, $13, $14, $15) RETURNING repeatid';
    const query = {
      text: insert,
      values: [eventname, description, businessid, starttime, endtime,
        capacity, sunday, monday, tuesday, wednesday, thursday, friday,
        saturday, repeattype, repeatend],
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

exports.checkRemainingEventCapacity = async (eventid) => {
  const insert = 'SELECT * FROM Attendees a WHERE a.eventid = $1';
  const query = {
    text: insert,
    values: [eventid],
  };

  const {rows} = await pool.query(query);
  return rows;
};
exports.getEvents = async () => {
  const select =
      'SELECT e.eventid, e.eventname, e.businessid, e.starttime, r.starttime'+
      ' AS repeatstart, e.endtime, e.capacity, e.description,' +
      'monday,tuesday,wednesday,thursday,friday,saturday,sunday,' +
      'r.repeattype,r.repeatend,e.repeatid '+
      'FROM (Events e LEFT JOIN RepeatingEvents r ON e.repeatid = r.repeatid)';
  const query = {
    text: select,
    values: [],
  };
  const days =
      {'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6};
  const {rows} = await pool.query(query);
  const rows2 = [];
  for (const i in rows) {
    if (rows.hasOwnProperty(i)) {
      const row = {};
      const rowDays = {};
      for (const j in rows[i]) {
        if (rows[i][j] === null) {
          continue;
        }
        if (j in days) {
          rowDays[j] = rows[i][j];
        } else {
          row[j] = rows[i][j];
        }
      }
      if (rows[i]['repeatid'] !== null) {
        row['repeatdays'] = rowDays;
      }
      // get number of attendees for each event
      const attendees = await exports.checkRemainingEventCapacity(row.eventid);
      row['attendees'] = attendees.length;
      rows2.push(row);
    }
  }
  return rows2;
};


exports.getEventByID = async (eventid) => {
  const queryText = 'SELECT * FROM Events e WHERE e.eventid = $1';
  const query = {
    text: queryText,
    values: [eventid],
  };

  const {rows} = await pool.query(query);
  return rows[0];
};

exports.getEventsByStart = async (starttime) => {
  const queryText = 'SELECT * FROM Events e WHERE e.starttime >= $1';
  const query = {
    text: queryText,
    values: [starttime],
  };

  const {rows} = await pool.query(query);
  return rows;
};

exports.getEventsByEnd = async (endtime) => {
  const queryText = 'SELECT * FROM Events e WHERE e.endtime <= $1';
  const query = {
    text: queryText,
    values: [endtime],
  };

  const {rows} = await pool.query(query);
  return rows;
};


exports.getEventsByRange = async (starttime, endtime) => {
  // start time must be a unix timestamp
  const queryText = 'SELECT * FROM Events e WHERE ' +
      'e.starttime >= $1 AND e.endtime <= $2';
  const query = {
    text: queryText,
    values: [starttime, endtime],
  };

  const {rows} = await pool.query(query);
  return rows;
};

// returns list of events for which userid is attending,
// had to join so that I could get the business name
exports.getUsersEvents = async (userid) => {
  const queryText =
    'SELECT e.eventid, e.description, e.eventname, e.businessid, ' +
    'e.starttime, r.starttime AS repeatstart, e.endtime, e.capacity, ' +
    'Businesses.businessname, ' + // Gets relevant information
    'monday,tuesday,wednesday,thursday,friday,saturday,sunday,' +
    'r.repeattype,r.repeatend,e.repeatid '+
    // Join the events and business table where businessid is the same
    'FROM Events e INNER JOIN Businesses ON ' +
    'e.businessid = Businesses.businessid ' +
    'LEFT JOIN RepeatingEvents r ON e.repeatid = r.repeatid ' +
    // Matches events w/ event id from attending when userid is the one given
    'WHERE e.eventid IN (SELECT eventid FROM attendees where userid = $1)';
  const query = {
    text: queryText,
    values: [userid],
  };

  const days =
      {'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6};
  const {rows} = await pool.query(query);
  const rows2 = [];
  for (const i in rows) {
    if (rows.hasOwnProperty(i)) {
      const row = {};
      const rowDays = {};
      for (const j in rows[i]) {
        if (rows[i][j] === null) {
          continue;
        }
        if (j in days) {
          rowDays[j] = rows[i][j];
        } else {
          row[j] = rows[i][j];
        }
      }
      if (rows[i]['repeatid'] !== null) {
        row['repeatdays'] = rowDays;
      }
      // get number of attendees for each event
      const attendees = await exports.checkRemainingEventCapacity(row.eventid);
      row['attendees'] = attendees.length;
      rows2.push(row);
    }
  }
  return rows2;
};

// returns list of events created by businessid
exports.getBusinessEvents = async (businessid) => {
  const queryText =
  'SELECT e.eventid, e.eventname, e.businessid, e.starttime, r.starttime ' +
      'AS repeatstart, e.endtime, e.capacity, e.description,' +
      'monday,tuesday,wednesday,thursday,friday,saturday,sunday,' +
      'r.repeattype,r.repeatend,e.repeatid FROM ' +
      '(Events e LEFT JOIN RepeatingEvents r ON e.repeatid = r.repeatid) ' +
      'WHERE e.businessid = $1';
  const query = {
    text: queryText,
    values: [businessid],
  };
  const days =
      {'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6};
  const {rows} = await pool.query(query);
  const rows2 = [];
  for (const i in rows) {
    if (rows.hasOwnProperty(i)) {
      const row = {};
      const rowDays = {};
      for (const j in rows[i]) {
        if (rows[i][j] === null) {
          continue;
        }
        if (j in days) {
          rowDays[j] = rows[i][j];
        } else {
          row[j] = rows[i][j];
        }
      }
      if (rows[i]['repeatid'] !== null) {
        row['repeatdays'] = rowDays;
      }
      // get number of attendees for each event
      const attendees = await exports.checkRemainingEventCapacity(row.eventid);
      row['attendees'] = attendees.length;
      rows2.push(row);
    }
  }
  return rows2;
};
