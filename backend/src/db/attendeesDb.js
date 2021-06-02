const pool = require('./dbConnection');

/* for the moment we will use this function to remove a user
*  from events after they are removed from the members table.
*  In order to cascade in the db we must indicate if the event
*  is for users only, so we can change that
*  but for a demo we can use this
*/
exports.removeMemberFromAttendees = async (businessid, userid) => {
  // select all eventids for the business, remove user from attendees table
  const deleteM = 'DELETE FROM Attendees a WHERE a.userid = $2 ' +
      'AND a.eventid IN (SELECT e.eventid FROM Events e ' +
      'WHERE e.businessid = $1) RETURNING *'; // return rows deleted
  const query = {
    text: deleteM,
    values: [businessid, userid],
  };

  const {rows} = await pool.query(query);
  return (rows.length);
};

exports.insertAttendees = async (eventid, userid) => {
  const insert = 'INSERT INTO Attendees (eventid, userid) VALUES ($1, $2)';
  const query = {
    text: insert,
    values: [eventid, userid],
  };

  const {rows} = await pool.query(query);
  return rows;
};

exports.checkUserAttending = async (eventid, userid) => {
  const select = 'SELECT * FROM Attendees a WHERE a.eventid = $1 ' +
      'AND a.userid = $2';
  const query = {
    text: select,
    values: [eventid, userid],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0);
};

// Removes user from the attendees table
exports.removeUserAttending = async (eventid, userid) => {
  const deleteU = 'DELETE FROM Attendees a WHERE a.userid = $1 ' +
      'AND a.eventid = $2 RETURNING a.eventid';
  const query = {
    text: deleteU,
    values: [userid, eventid],
  };

  const {rows} = await pool.query(query);
  return (rows.length);
};
