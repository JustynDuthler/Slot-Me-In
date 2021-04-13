const db = require('./db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const auth = require('./auth');


dotenv.config();
const User = db.Users;

exports.signup = async (req, res) => {

  // hash password using bcrypt with 10 salt rounds
  bcrypt.hash(req.body.password, 10, (error, hash) => {
    if (error) {
      res.status(500).json(error);
      return;
    }
    else {
      // TODO: add once db is implemented
      // if email or username already exists in db
      //    then res.status(409)
      // else 
      //    add email, username, hashed password to db 
      //    res.status(200) and return json web token
      const userNameExists = User.findOne({ where: { userName: req.body.userName } });
      const userEmailExists = User.findOne({ where: { userEmail: req.body.userEmail } });

      if (userNameExists !== null && userEmailExists !== null) {
        res.status(409);
        console.log('User already taken!');
      }
      else {
        const insert = 'INSERT INTO Users (userName, Password, userEmail) VALUES ($1, $2, $3) RETURNING userID';
        const query = {
          text: insert,
          values: [userName, Password, userEmail],
        };
        res.status(201).json({auth_token: 'token'});
        console.log('User added! ' + req.body.userName + ' ' + req.body.userEmail);

        const {rows} = pool.query(query);
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
        res.status(200).json({auth_token: auth.generateJWT(account.email, account.id, 'user')});
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
