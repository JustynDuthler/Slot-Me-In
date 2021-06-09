const pool = require('./dbConnection');

// Inserts a new event entry into the database
// Returns the newly created event eventid
exports.insertEvent =
    async (eventname, starttime, endtime, businessid,
        capacity, description, membersonly,
        over18, over21, category=null, repeatid=null) => {
      const insert = 'INSERT INTO Events ' +
          '(eventname, starttime, endtime, businessid, capacity, ' +
          'description, membersonly, over18, over21, category, repeatid) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
          'RETURNING eventid';
      const query = {
        text: insert,
        values: [eventname, starttime, endtime, businessid,
          capacity, description, membersonly, over18, over21,
          category, repeatid],
      };

      const {rows} = await pool.query(query);
      return rows[0].eventid;
    };

exports.insertRepeatingEvent =
  async (eventname, description, businessid, starttime, endtime, capacity,
      membersonly, over18, over21, category=null,
      sunday, monday, tuesday, wednesday, thursday, friday, saturday,
      repeattype='w', repeatend) => {
    const insert = 'INSERT INTO RepeatingEvents ' +
        '(eventname, description, businessid, starttime, endtime, ' +
        'capacity, membersonly, over18, over21, category, ' +
        'sunday, monday, tuesday, wednesday, thursday, ' +
        'friday, saturday, repeattype, repeatend) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ' +
        '$11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING repeatid';
    const query = {
      text: insert,
      values: [eventname, description, businessid, starttime, endtime,
        capacity, membersonly, over18, over21, category,
        sunday, monday, tuesday, wednesday, thursday, friday,
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

exports.deleteFollowingEvents = async (repeatid, starttime) => {
  const del = 'DELETE FROM Events WHERE repeatid = $1 AND starttime >= $2';
  const query = {
    text: del,
    values: [repeatid, starttime],
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


// default values for start/end time queries so that all events
//    are retrieved when no queries are provided
exports.getEvents = async (start='2000-01-01T00:00:00.000Z',
    end='3000-01-01T00:00:00.000Z',
    search='', category='', membersonly, over18, over21) => {
  let select =
      'SELECT e.eventid, e.eventname, e.businessid, e.starttime, r.starttime'+
      ' AS repeatstart, e.endtime, e.capacity,e.description,e.over18,e.over21,'+
      'e.membersonly, e.category,'+
      'monday,tuesday,wednesday,thursday,friday,saturday,sunday,' +
      'r.repeattype,r.repeatend,e.repeatid, e.category ' +
      'FROM (Events e LEFT JOIN RepeatingEvents r ON e.repeatid = r.repeatid) '+
      'WHERE e.starttime >= $1 AND e.endtime <= $2 AND ' +
      '(e.eventname ~* $3 OR e.description ~* $3)';
  let values = [start, end, search];
  if (category) {
    values.push(category);
    select += ' AND e.category = $' + values.length;
  };
  if (membersonly) {
    values.push(membersonly);
    select += ' AND e.membersonly = $' + values.length;
  };
  if (over18) {
    values.push(over18);
    select += ' AND e.over18 = $' + values.length;
  };
  if (over21) {
    values.push(over21);
    select += ' AND e.over21 = $' + values.length;
  };
  const query = {
    text: select,
    values: values,
  };
  let {rows} = await pool.query(query);
  rows = getEventRepeatDays(rows);
  rows = await getEventAttendees(rows);
  return rows;
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

// returns list of events for which userid is attending,
// had to join so that I could get the business name
exports.getUsersEvents = async (userid) => {
  const queryText =
    'SELECT e.eventid, e.description, e.eventname, e.businessid, ' +
    'e.starttime, r.starttime AS repeatstart, e.endtime, e.capacity, ' +
    'Businesses.businessname, ' + // Gets relevant information
    'e.over18, e.over21, e.membersonly, e.category,' +
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

  let {rows} = await pool.query(query);
  rows = getEventRepeatDays(rows);
  rows = await getEventAttendees(rows);
  return rows;
};

// returns list of events created by businessid
exports.getBusinessEvents = async (businessid, start='2000-01-01T00:00:00.000Z',
    end='3000-01-01T00:00:00.000Z',
    search='', category='', membersonly, over18, over21) => {
  let queryText =
  'SELECT e.eventid, e.eventname, e.businessid, e.starttime, r.starttime ' +
      'AS repeatstart, e.endtime, e.capacity, e.description,' +
      'e.over18, e.over21, e.membersonly, e.category,' +
      'monday,tuesday,wednesday,thursday,friday,saturday,sunday,' +
      'r.repeattype,r.repeatend,e.repeatid FROM ' +
      '(Events e LEFT JOIN RepeatingEvents r ON e.repeatid = r.repeatid) ' +
      'WHERE e.businessid = $1 AND e.starttime >= $2 AND e.endtime <= $3 AND ' +
      '(e.eventname ~* $4 OR e.description ~* $4)';
  let values = [businessid, start, end, search];
  if (category) {
    values.push(category);
    queryText += ' AND e.category = $' + values.length;
  };
  if (membersonly) {
    values.push(membersonly);
    select += ' AND e.membersonly = $' + values.length;
  };
  if (over18) {
    values.push(over18);
    select += ' AND e.over18 = $' + values.length;
  };
  if (over21) {
    values.push(over21);
    select += ' AND e.over21 = $' + values.length;
  };
  const query = {
    text: queryText,
    values: values,
  };
  let {rows} = await pool.query(query);
  rows = getEventRepeatDays(rows);
  rows = await getEventAttendees(rows);
  return rows;
};

exports.getPublicEvents = async () => {
  const SELECT = 'SELECT * FROM Events WHERE membersonly = FALSE';
  const query = {
    text: SELECT,
    values: [],
  };
  let {rows} = await pool.query(query);
  rows = await getEventAttendees(rows);
  return rows;
};

/** get repeat days for events
 * @return {Array} Rows with repeatdays property added
 * @param {Array} rows Rows from a SELECT FROM Events db query
 */
function getEventRepeatDays(rows) {
  const days =
      {'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6};
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
      rows2.push(row);
    }
  }
  return rows2;
}

/** get attendees for events
 * @return {Array} Rows with repeatdays property added
 * @param {Array} rows Rows from a SELECT FROM Events db query
 */
getEventAttendees = async (rows) => {
  for (const i in rows) {
    if (rows.hasOwnProperty(i)) {
      // get number of attendees for each event
      const attendees = await exports.checkRemainingEventCapacity(rows[i].eventid);
      rows[i]['attendees'] = attendees.length;
    }
  }
  return rows;
}
