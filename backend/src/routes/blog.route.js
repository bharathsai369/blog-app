import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getTrendingBlogs,
  getFeaturedBlogs,
  getCategories,
  getTags,
  toggleLike,
  addComment,
  deleteComment,
} from "../controllers/blog.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getBlogs); // GET /api/blogs
router.get("/trending", getTrendingBlogs); // GET /api/blogs/trending
router.get("/featured", getFeaturedBlogs); // GET /api/blogs/featured
router.get("/categories", getCategories); // GET /api/blogs/categories
router.get("/tags", getTags); // GET /api/blogs/tags
router.get("/:id", getBlogById); // GET /api/blogs/:id

// Protected routes
router.post("/", protectRoute, createBlog); // POST /api/blogs
router.put("/edit/:id", protectRoute, updateBlog); // PUT /api/blogs/edit/:id
router.delete("/:id", protectRoute, deleteBlog); // DELETE /api/blogs/:id

// Like/Unlike blog
router.post("/:id/like", protectRoute, toggleLike); // POST /api/blogs/:id/like

// Comments
router.post("/:id/comments", protectRoute, addComment); // POST /api/blogs/:id/comments
router.delete("/:id/comments/:commentId", protectRoute, deleteComment); // DELETE /api/blogs/:id/comments/:commentId

export default router;
