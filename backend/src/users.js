const db = require('./db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.signup = async (req, res) => {

  // hash password using bcrypt with 10 salt rounds
  bcrypt.hash(req.body.password, 10, async (error, hash) => {
    if (error) {
      res.status(500).json(error);
      // return;
    }
    else {

      const userNameExists = 'SELECT (userName) FROM users VALUES ($1)';
      const userNameExistsQuery = {
        text: userNameExists,
        values: [req.body.userName],
      };

      const userEmailExists = 'SELECT (userEmail) FROM users VALUES ($1)';
      const userEmailExistsQuery = {
        text: userEmailExists,
        values: [req.body.userEmail],
      };

      try {
        const {nameRes} = await pool.query(userNameExists);
        const {emailRes} = await pool.query(userEmailExists);
      } catch (err) {
        console.error(err.message);
      }

      console.log('name length: ' + userNameExists.length + ' email length: ' + userEmailExists.length);
      if (userNameExists.length !== 0 || userEmailExists.length !== 0) {
        res.status(409);
        console.log('User already taken!');
      }
      else {
        const insert = 'INSERT INTO users (userName, Password, userEmail) VALUES ($1, $2, $3) RETURNING userID';
        const query = {
          text: insert,
          values: [req.body.userName, req.body.Password, req.body.userEmail],
        };
        const {rows} = await pool.query(query);
        user => {res.status(201).json({token: generateToken(user)})};
        console.log('User added! ' + req.body.userName + ' ' + req.body.userEmail);
        return rows[0].userID;
      }
    }
  })
};

exports.login = async (req, res) => {
  const account = undefined;  // TODO: replace to query db for user once db is implemented
  if (!account) res.status(404).send();
  else {
    // compare given password to hashed password in db
    bcrypt.compare(req.body.password, account.password, (error, match) => {
      if (error)
        res.status(500).json(error)
      else if (match)
        res.status(200).json({token: generateToken(account)});
      else
        res.status(403).send();
    })
  }
};

exports.getEvents = async (req, res) => {
  // const userID = req.params.userID;
  const account = undefined;  // TODO: replace to query db for user once db is implemented
  if (!account) res.status(404).send();
  // TODO: query DB for all events this user has signed up for
  const events = [];
  res.status(200).json(events);
};

function generateToken(account) {
  return jwt.sign({data: account}, process.env.TOKEN_SECRET, {expiresIn: '24h'});
}
