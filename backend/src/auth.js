const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// If the JWT token is valid, sets req.user and goes to next part
// If there is no token it sends a 401
// If there is an error in the 
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
}

module.exports = authenticateToken;