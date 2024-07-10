const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

function generateToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

function authenticate(req, res, next) {
  const token = req.body.encryptedData;
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ status: "error", message: "Invalid token" });
  }

  req.user = decoded;
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
};
