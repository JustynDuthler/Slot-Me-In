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
    } else {
      // check if username/email is already in use
      const emailRes = await db.checkBusinessEmailTaken(req.body.email);
      if (emailRes) {
        res.status(409).send();
        console.log('Email already taken!');
      }
      else {
        // dummy phone number
        const businessid = await db.insertBusinessAccount(req.body.name, hash, '123-456-7890', req.body.email);
        const token = await auth.generateJWT(req.body.email, businessid, 'business');
        console.log('Business added!');
        res.status(201).json({auth_token: token});
      }
    }
  })
};

exports.login = async (req, res) => {
  const account = await db.checkBusinessEmailTaken(req.body.email);
  // 404 if email not found
  if (!account) res.status(404).send();
  else {
    // compare given password to hashed password in db
    const pass = await db.getBusinessPass(req.body.email);
    const match = await bcrypt.compare(req.body.password, pass);
    // if passwords match, generate JWT and send 200
    if (match) {
      const token = 
          await auth.generateJWT(account.businessemail, account.businessid, 'business');
      res.status(200).json({'auth_token': token});
    }
    else {
      // 401 if incorrect password
      res.status(401).send();
    }
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

exports.getEvents = async (req, res) => {
  // jwt will return 401 or 403 if id is not a business
  res.status(200).send();
}