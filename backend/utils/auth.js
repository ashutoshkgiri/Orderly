import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const jwtSecret = process.env.JWT_SECRET || 'changeme';

function signToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const [, token] = authHeader.split(' ');
  try {
    const data = jwt.verify(token, jwtSecret);
    req.user = data;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
export { signToken, authMiddleware };