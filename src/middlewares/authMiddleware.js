import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    // console.log("Auth middleware triggered");
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or invalid" });
    }
    // console.log("Auth Header:", authHeader);
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Token in urlservice", decoded)

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized or token expired" });
  }
};
