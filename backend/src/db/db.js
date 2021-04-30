const pool = require('./dbConection');

// basic testing query
exports.dbTest = async () => {
  pool.query('SELECT * FROM USERS', (err, res) => {
    console.log(err, res);
    pool.end;
  });
};


