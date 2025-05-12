const jwt = require("jsonwebtoken");


exports.authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    console.log("Token received:", token); 
    console.log("JWT Secret:", process.env.JWT_SECRET); 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
    
      if (!roles.includes(req.user.roles)) {
        return res.status(403).json({ error: "Access denied: Insufficient permissions" });
      }
      next();
    } catch (error) {
      console.error("Authorization error:", error.message);
      res.status(500).json({ error: "Internal server error during authorization" });
    }
  };
};