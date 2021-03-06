const userDb = require('../db/userDb');
const eventsDb = require('../db/eventsDb');
const attendeesDb = require('../db/attendeesDb');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const auth = require('../auth');

exports.getInfo = async (req, res) => {
  const user = await userDb.selectUser(req.payload.id);
  const userData = {
    userid: user.userid,
    username: user.username,
    useremail: user.useremail,
    birthdate: user.birthdate,
  };
  res.status(200).json(userData);
};

exports.signup = async (req, res) => {
  // hash password using bcrypt with 10 salt rounds
  bcrypt.hash(req.body.password, 10, async (error, hash) => {
    if (error) {
      res.status(500).json(error);
    } else {
      // check if username/email is already in use
      const emailRes = await userDb.checkUserEmailTaken(req.body.email);
      if (emailRes) {
        res.status(409).send();
      } else {
        const userid =
            await userDb.insertUserAccount(
                req.body.name, hash, req.body.email.toLowerCase(),
                req.body.birthdate);
        const token =
            await auth.generateJWT(
                req.body.email.toLowerCase(), userid, 'user');
        res.status(201).json({auth_token: token});
      }
    }
  });
};

exports.login = async (req, res) => {
  const account = await userDb.checkUserEmailTaken(req.body.email);
  // 404 if email not found
  if (!account) res.status(404).send();
  else {
    // compare given password to hashed password in db
    const pass = await userDb.getUserPass(req.body.email);
    const match = await bcrypt.compare(req.body.password, pass);
    // if passwords match, generate JWT and send 200
    if (match) {
      const token =
          await auth.generateJWT(account.useremail, account.userid, 'user');
      res.status(200).json({auth_token: token});
    } else {
      // 401 if incorrect password
      res.status(401).send();
    }
  }
};

exports.getEvents = async (req, res, next) => {
  const userID = req.payload.id;
  eventsDb.getUsersEvents(userID)
      .then((events) => {
        res.status(200).send(events);
      })
      .catch((error) => {
        error.status=500;
        next(error);
      });
};

exports.removeUserAttending = async (req, res) => {
  const userID = req.payload.id;
  const eventID = req.body.eventid;

  const ret = await attendeesDb.removeUserAttending(eventID, userID);
  if (ret) {
    res.status(200).send();
  } else {
    res.status(403).send();
  }
};
