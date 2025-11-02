import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, email, password: hash });

    res.status(201).json({ message: "Register success", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  console.log("JWT_SECRET in login:", JWT_SECRET);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email/password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email/password" });

    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, {
      expiresIn: "1d",
    });
    const randomString = crypto.randomUUID();

    const apiKey = `mern-${user._id}-${email}-${token}-${randomString}`;
    user.apiKey = apiKey;
    await user.save();

    res.json({ message: "Login success", apiKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
