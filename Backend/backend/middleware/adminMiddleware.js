const jwt = require("jsonwebtoken");

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, "secretkey");

    if (verified.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = adminMiddleware;