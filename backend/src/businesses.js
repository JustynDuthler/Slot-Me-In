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
      const emailRes = await db.checkBusinessEmailTaken(1, req.body.email);
      const nameRes = await db.checkBusinessNameTaken(req.body.name);

      if (nameRes.length > 0 || emailRes.length > 0) {
        // returns 500
        res.status(409).json(error);
        console.log('Name/email already taken!');
      }
      else {
        // dummy phone number
        const businessID = await db.insertBusinessAccount(req.body.name, hash, '123-456-7890', req.body.email);
        const token = await auth.generateJWT(req.body.email, businessID, 'user');
        console.log('Business added!');
        res.status(201).json({auth_token: token});
      }
    }
  })

};

exports.login = async (req, res) => {

  const account = await db.checkBusinessEmailTaken(1, req.body.email);

  // email not found
  if (account.length === 0) res.status(404).send();
  else {
    // compare given password to hashed password in db
    const pass = await db.checkBusinessEmailTaken(2, req.body.email);
    const match = await bcrypt.compare(req.body.password, pass);
    if (match) {
      // returns 500
      const token = await auth.generateJWT(account.email, account.id, 'user');
      res.status(200).json({'auth_token': token});
    }
    else {
      // incorrect password
      res.status(403).send();
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

function generateToken(account) {
  return jwt.sign({data: account}, process.env.TOKEN_SECRET, {expiresIn: '24h'});
}
