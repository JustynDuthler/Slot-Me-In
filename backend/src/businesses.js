const db = require('./db');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const auth = require('./auth');

exports.getInfo = async (req, res) => {
  const business = await db.selectBusiness(req.payload.id);
  const businessData = {
    businessid: business.businessid,
    businessname: business.businessname,
    email: business.businessemail,
    phonenumber: business.phonenumber,
  };
  res.status(200).json(businessData);
};

exports.getBusinessByID = async (req, res) => {
  const business = await db.selectBusiness(req.params.businessid);
  const businessData = {
    businessid: business.businessid,
    businessname: business.businessname,
    email: business.businessemail,
    phonenumber: business.phonenumber,
  };
  res.status(200).json(businessData);
};

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
      } else {
        // dummy phone number
        const businessid = await db.insertBusinessAccount(
            req.body.name, hash, '123-456-7890', req.body.email.toLowerCase());
        const token = await auth.generateJWT(
            req.body.email.toLowerCase(), businessid, 'business');
        console.log('Business added!');
        res.status(201).json({auth_token: token});
      }
    }
  });
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
          await auth.generateJWT(
              account.businessemail, account.businessid, 'business');
      res.status(200).json({'auth_token': token});
    } else {
      // 401 if incorrect password
      res.status(401).send();
    }
  }
};

exports.getEvents = async (req, res) => {
  // now takes businessID from payload
  const businessID = req.payload.id;
  if (businessID == null) {
    throw new Error('businessID was null');
  }
  db.getBusinessEvents(businessID)
      .then((events) => {
        res.status(200).send(events);
      })
      .catch((error) => {
        error.status=500;
        console.log(error);
        res.status(500).send(error);
      });
};

exports.validID = async (req, res) => {
  // jwt will return 401 or 403 if id is not a business
  res.status(200).send();
};
