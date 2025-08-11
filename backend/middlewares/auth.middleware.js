const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersegreto';

function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;  // leggi il cookie 'token'
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, JWT_SECRET); // verifica token
    req.userId = decoded.userId; // salva userId nella request per usarlo nelle route protette
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = authMiddleware;
