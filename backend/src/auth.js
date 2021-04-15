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
// If inputs are invalid, it throws an error
exports.generateJWT = async (email, id, userType, time="24h") => {
  const idRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(email) || !idRegex.test(id) || (userType != 'user' && userType != 'business')) {
    throw new Error('Invalid input when generating JWT');
  }
  const token = await jwt.sign({email: email, id: id, userType: userType}, process.env.TOKEN_SECRET, {expiresIn: time});
  return token;
}
