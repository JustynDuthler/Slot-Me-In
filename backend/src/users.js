const db = require('./db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = require('./auth');

exports.getInfo = async (req, res) => {
  const user = await db.selectUser(req.payload.id);
  const userData = {
    userid: user.userid,
    username: user.username,
    email: user.useremail,
  };
  res.status(200).json(userData);
}

exports.signup = async (req, res) => {
  // hash password using bcrypt with 10 salt rounds
  bcrypt.hash(req.body.password, 10, async (error, hash) => {
    if (error) {
      res.status(500).json(error);
    } else {
      // check if username/email is already in use
      const emailRes = await db.checkUserEmailTaken(req.body.email);
      if (emailRes) {
        res.status(409).send();
        console.log('Email already taken!');
      }
      else {
        const userid = await db.insertUserAccount(req.body.name, hash, req.body.email);
        const token = await auth.generateJWT(req.body.email, userid, 'user');
        res.status(201).json({auth_token: token});
      }
    }
  })
};

exports.login = async (req, res) => {
  const account = await db.checkUserEmailTaken(req.body.email);
  // 404 if email not found
  if (!account) res.status(404).send();
  else {
    // compare given password to hashed password in db
    const pass = await db.getUserPass(req.body.email);
    const match = await bcrypt.compare(req.body.password, pass);
    // if passwords match, generate JWT and send 200
    if (match) {
      const token = 
          await auth.generateJWT(account.useremail, account.userid, 'user');
      res.status(200).json({auth_token: token});
    }
    else {
      // 401 if incorrect password
      res.status(401).send();
    }
  }
};

exports.getEvents = async (req, res) => {
  const userID = req.payload.id;
  if (userID == null) {
    throw new Error('UserID was null');
  }

  db.getUsersEvents(userID)
  .then((events) => {
    res.status(200).send(events);
  })
  .catch((error) => {
    console.log('GetEvents error: ', error);
  });
};
