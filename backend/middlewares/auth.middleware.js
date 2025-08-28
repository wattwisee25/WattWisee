import jwt from "jsonwebtoken";



function authMiddleware(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET;
  try {
    const token = req.cookies.token;  // leggi il cookie 'token'

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET); // verifica token
    req.userId = decoded.id; // <--- usa 'id' come nel token
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Token is not valid" });
  }
}

export default authMiddleware;
