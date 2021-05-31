const pool = require('./dbConnection');

// For creating a new user account
exports.insertUserAccount = async (username, password, email, birthdate) => {
  const insert = 'INSERT INTO Users ' +
        '(username, password, useremail, birthdate) ' +
        'VALUES ($1, $2, $3, $4) RETURNING userid';
  const query = {
    text: insert,
    values: [username, password, email, birthdate],
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
  return (rows.length > 0 ? rows[0] : undefined);
};

// check if an email is already in use
exports.checkUserEmailTaken = async (email) => {
  const insert = 'SELECT * FROM Users u WHERE u.useremail ILIKE $1';
  const query = {
    text: insert,
    values: [email],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0 ? rows[0] : undefined);
};

// get a user hashed password
exports.getUserPass = async (email) => {
  const insert = 'SELECT password FROM Users u WHERE u.useremail ILIKE $1';
  const query = {
    text: insert,
    values: [email],
  };

  const {rows} = await pool.query(query);
  return rows[0].password;
};

exports.getUserIDByEmail = async (useremail) => {
  const select = 'SELECT u.userid FROM Users u WHERE u.useremail ILIKE $1';
  const query = {
    text: select,
    values: [useremail],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0 ? rows[0].userid : null);
};
