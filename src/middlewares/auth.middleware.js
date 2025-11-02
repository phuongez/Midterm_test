import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  const apiKey = req.query.apiKey;
  if (!apiKey) return res.status(401).json({ message: "Missing apiKey" });

  const parts = apiKey.split("-");
  if (parts.length < 5 || parts[0] !== "mern")
    return res.status(400).json({ message: "Invalid apiKey format" });

  const userId = parts[1];
  const email = parts[2];
  const token = parts[3];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userId !== userId || decoded.email !== email)
      return res.status(401).json({ message: "Invalid token" });

    const user = await User.findOne({ _id: userId, email, apiKey });
    if (!user)
      return res.status(401).json({ message: "apiKey not found or expired" });

    req.user = user;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Token expired or invalid", error: err.message });
  }
};
