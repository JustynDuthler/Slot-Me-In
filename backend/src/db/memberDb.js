const pool = require('./dbConnection');

// Inserts a email into the members table
exports.insertMembers = async (memberlist) => {
  const insert = 'INSERT INTO Members(businessid, memberemail, userid) ' +
        'VALUES ' + memberlist + ' RETURNING userid';
  const query = {
    text: insert,
  };

  const {rows} = await pool.query(query);
  return (rows.length);
};

// Gets all member userid's from the members table for a specific businessid
// Returns undefined if none found
exports.getMembersForBusiness = async (businessid) => {
  const select = 'SELECT m.userid FROM Members m WHERE m.businessid = $1';
  const query = {
    text: select,
    values: [businessid],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0 ? rows : undefined);
};

// removes user from members table
exports.removeMember = async (businessid, userid) => {
  const deleteM = 'DELETE FROM Members m WHERE m.businessid = $1 ' +
        'AND m.userid = $2 RETURNING m.userid';
  const query = {
    text: deleteM,
    values: [businessid, userid],
  };

  const {rows} = await pool.query(query);
  return (rows.length);
};

// returns user for a list of user's based on userid
exports.getMemberUserInfo = async (useridlist) => {
  const select = 'SELECT u.userid, u.username, u.useremail ' +
      'FROM Users u WHERE (u.userid::text) IN ( VALUES ' + useridlist + ')';
  const query = {
    text: select,
  };

  const {rows} = await pool.query(query);
  return (rows);
};
