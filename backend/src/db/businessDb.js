const pool = require('./dbConnection');

exports.insertBusinessAccount =
    async (businessname, password, phonenumber, businessemail) => {
      const insert = 'INSERT INTO Businesses ' +
      '(businessname, Password, phonenumber, businessemail) ' +
      'VALUES ($1, $2, $3, $4) RETURNING businessid';
      const query = {
        text: insert,
        values: [businessname, password, phonenumber, businessemail],
      };

      const {rows} = await pool.query(query);
      return rows[0].businessid;
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

// check if a business email is already in use
exports.checkBusinessEmailTaken = async (email) => {
  const insert = 'SELECT * FROM Businesses b WHERE b.businessemail ILIKE $1';
  const query = {
    text: insert,
    values: [email],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0 ? rows[0] : undefined);
};

// get a business hashed password
exports.getBusinessPass = async (email) => {
  const insert = 'SELECT password FROM Businesses b ' +
      'WHERE b.businessemail ILIKE $1';
  const query = {
    text: insert,
    values: [email],
  };

  const {rows} = await pool.query(query);
  return rows[0].password;
};

// inserts image name into database
exports.insertProfileImageName = async (businessid, imagename) => {
  const insert = 'INSERT INTO Businesses (businessimagename) VALUES ($2)' +
                 'WHERE $1 = businessid RETURNING businessid';
  const query = {
    text: insert,
    values: [businessid, imagename],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0 ? 1 : 0); // if insert was successful return 1
}