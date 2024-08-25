const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

// generate access token function 
function generateToken(user) {
  const accessToken = jwt.sign({ user: user }, process.env.ACCESS_TOKEN, { expiresIn: '1h' }); // sign the user with the access token
  return accessToken
}


module.exports = {authenticateToken, generateToken};
