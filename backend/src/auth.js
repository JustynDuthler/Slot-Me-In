const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware for authenticating JWT
exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    // If no token is found send 401
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if(err) {
        console.log(err);
      }

      // If the token is invalid send 403
      if (err) return res.sendStatus(403)

      // If all is good set req.payload to the payload of the JWT
      req.payload = decoded;
      next();
    })
};

exports.authenticateUserJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  // If no token is found send 401
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if(err) {
      console.log(err);
    }

    // If the token is invalid send 403
    if (err) return res.sendStatus(403)

    if (decoded.userType != 'user') {
      res.sendStatus(403);
    }

    // If all is good set req.payload to the payload of the JWT
    req.payload = decoded;
    next();
  })
};

exports.authenticateBusinessJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  // If no token is found send 401
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if(err) {
      console.log(err);
    }

    // If the token is invalid send 403
    if (err) return res.sendStatus(403)
    if (decoded.userType != 'business') {
      res.sendStatus(403);
    }

    // If all is good set req.payload to the payload of the JWT
    req.payload = decoded;
    next();
  })
};


// Generates a JWT for a user based on their email, database id, and userType('')
exports.generateJWT = async (email, id, userType, time="24h") => {
  return jwt.sign({email: email, id: id, userType: userType}, process.env.TOKEN_SECRET, {expiresIn: time});
}
