const jwt = require("jsonwebtoken");
const SECRET_KEY = "Secret Key";
const authenticateToken = (req, res, next) => {
  console.log("authenticateToken middleware called");
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log("Error verifying token:", err.message);
      console.log(`token:${token}`);
      return res.status(403).json({ error: "Invalid token" });
    }

    // Debugging: Log the user data
    console.log("Decoded user data:", user);

    req.user = user;
    next();
  });
};
module.exports = authenticateToken;
