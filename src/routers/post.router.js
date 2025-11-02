import express from "express";
import { createPost, updatePost } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);

export default router;
