const db = require('./db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = require('./auth');

exports.signup = async (req, res) => {

  // hash password using bcrypt with 10 salt rounds
  bcrypt.hash(req.body.password, 10, async (error, hash) => {
    if (error) {
      res.status(500).json(error);
      return;
    } else {

      // check if username/email is already in use
      const emailRes = await db.checkUserEmailTaken(req.body.email);
      const nameRes = await db.checkUserNameTaken(req.body.name);

      // this returns 500 for some reason
      if (nameRes.length > 0 || emailRes.length > 0) {
        res.status(409).json(error);
        console.log('User already taken!');
      }
      else {
        const userID = await db.insertUserAccount(req.body.name, hash, req.body.email);
        const token = await auth.generateJWT(req.body.email, userID, 'user');
        res.status(201).json({auth_token: token});
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