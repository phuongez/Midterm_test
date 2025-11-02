import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectMongo from "./src/config/connectMongo.config.js";
import userRoutes from "./src/routers/user.router.js";
import postRoutes from "./src/routers/post.router.js";

const app = express();
app.use(express.json());

// Kết nối MongoDB
connectMongo();

const PORT = process.env.PORT || 3002;

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log("✅ JWT_SECRET =", process.env.JWT_SECRET);
});
