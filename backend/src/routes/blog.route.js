import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createBlog); // POST /api/blogs

router.get("/", getBlogs); // GET /api/blogs

router.get("/:id", getBlogById); // GET /api/blogs/:id
// Add .populate("author", "username") when fetching blogs if you want author details shown.

router.put("/edit/:id", protectRoute, updateBlog); // PUT /api/blogs/:id

router.delete("/:id", protectRoute, deleteBlog); // DELETE /api/blogs/:id

export default router;
