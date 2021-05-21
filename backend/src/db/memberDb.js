const pool = require('./dbConnection');
const eventsDb = require('./eventsDb');

// Inserts a list of emails into the members table
// If there is a conflict (email already added) it does nothing
exports.insertMembers = async (emailList, businessId) => {
  let valueString = '';
  for (i = 0; i < emailList.length; i++) {
    valueString += ((valueString === '' ? '' : ', ') +
      `('${emailList[i]}', '${businessId}')`);
  }
  const insert = 'INSERT INTO Members (memberemail, businessid) ' +
                  'VALUES ' + valueString +
                  ' ON CONFLICT DO NOTHING RETURNING memberemail';
  const query = {
    text: insert,
  };
  return pool.query(query)
      .then((response) => {
        console.log(response.rowCount + ' Emails added in insertMembers');
      })
      .catch((error) => {
        console.log('Error in insertMember response: ' + error.stack);
      });
};

/* gets userids for member emails */
exports.getMemberUserNameID = async (memberemail) => {
  const select = 'SELECT userid, username FROM Users WHERE $1 = useremail';
  const query = {
    text: select,
    values: [memberemail],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0 ? rows[0] : null);
  // return userid or null if not member
};

// Gets all member emails and userid's from the members table
// Returns an object with withId and with withoutId
exports.getMemberList = async (businessid) => {
  const select = 'SELECT memberemail FROM Members WHERE businessid = $1';
  const query = {
    text: select,
    values: [businessid],
  };

  return pool.query(query)
      .then((response) => {
        const rows = response.rows;
        const emailList = [];
        for (i = 0; i < rows.length; i++) {
          emailList.push(rows[i].memberemail);
        }
        return emailList;
      })
      .catch((error) => {
        console.error('Error in getMemberList: ' + error.stack);
        next(error);
      });
};

// removes user from members table
exports.removeMember = async (businessid, email) => {
  const deleteM = 'DELETE FROM Members WHERE businessid = $1 ' +
        'AND memberemail = $2 RETURNING memberemail';
  const query = {
    text: deleteM,
    values: [businessid, email],
  };

  const {rows} = await pool.query(query);
  return (rows.length);
};

// gets a members businesses
exports.getMemberBusinesses = async (email) => {
  const select = 'SELECT * FROM Members m WHERE m.memberemail = $1';
  const query = {
    text: select,
    values: [email],
  };

  const {rows} = await pool.query(query);
  return rows;
};

// gets a businesses restricted events
exports.getBusinessRestrictedEvents = async (businessid) => {
  const select = 'SELECT * FROM Events WHERE businessid = $1 ' +
      'AND membersonly = TRUE';
  const query = {
    text: select,
    values: [businessid],
  };
  const {rows} = await pool.query(query);
  for (const i in rows) {
    if (rows.hasOwnProperty(i)) {
      // get number of attendees for each event
      const attendees = await eventsDb.checkRemainingEventCapacity(
          rows[i].eventid);
      rows[i]['attendees'] = attendees.length;
    }
  }
  return rows;
};

// check if user is a member of business
exports.checkUserIsMember = async (businessid, useremail) => {
  const select = 'SELECT * FROM Members WHERE ' +
      'businessid = $1 AND memberemail = $2';
  const query = {
    text: select,
    values: [businessid, useremail],
  };
  const {rows} = await pool.query(query);
  return (rows.length > 0);
};
