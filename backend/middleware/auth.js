import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized. Please log in again." });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId to the request body
    req.body.userId = decodedToken.id;

    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
};

export default authUser;
