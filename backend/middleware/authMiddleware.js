const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'replace_this_with_a_secret';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token missing' });

  const [scheme, token] = authHeader.split(' ');
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Token error' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};
