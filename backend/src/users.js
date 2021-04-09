// const db = require()
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const tokenSecret = "tempTokenSecret";

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
  const user = {};  // TODO: replace to query db for user once db is implemented
  if (!user) res.status(404).send();
  else {
    // compare given password to hashed password in db
    bcrypt.compare(req.body.password, user.password, (error, match) => {
      if (error)
        res.status(500).json(error)
      else if (match)
        res.status(200).json({token: generateToken(user)});
      else
        res.status(403).send();
    })
  }
};

function generateToken(user) {
  return jwt.sign({data: user}, tokenSecret, {expiresIn: '24h'});
}
