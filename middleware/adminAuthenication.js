const { verifyToken } = require("../service/tokenAuthentication");

exports.adminAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id };
    req.type = payload.type;

    // Check if the user type is "Admin"
    if (payload.type !== "Admin") {
      return res.status(401).json({
        message: "You are not authorized to get admin details",
      });
    }

    return next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.toString() });
  }
};