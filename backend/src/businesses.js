const db = require('./db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.signup = async (req, res) => {
  // hash password using bcrypt with 10 salt rounds
  bcrypt.hash(req.body.password, 10, (error, hash) => {
    if (error)
      res.status(500).json(error)
    else {
      // TODO: add once db is implemented
      // if email or username already exists in db
      //    then res.status(409)
      // else
      //    add email, username, hashed password to db
      //    res.status(200) and return json web token
      res.status(200).send();
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
        res.status(200).json({auth_token: auth.generateJWT(account.email, account.id, 'business')});
      else
        res.status(403).send();
    })
  }
};

exports.getEvents = async (req, res) => {
  // const businessID = req.params.businessID;
  const account = undefined;  // TODO: replace to query db for user once db is implemented
  if (!account) res.status(404).send();
  // TODO: query DB for all events this business has created
  const events = [];
  res.status(200).json(events);
};

function generateToken(account) {
  return jwt.sign({data: account}, process.env.TOKEN_SECRET, {expiresIn: '24h'});
}
