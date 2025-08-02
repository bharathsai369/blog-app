import express from "express";
import {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  getUserByUsername,
  toggleFollow,
  searchUsers,
  checkAuth,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check", protectRoute, checkAuth);

// Protected routes
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, updateProfile);
router.get("/user/:username", getUserByUsername);
router.post("/follow/:username", protectRoute, toggleFollow);
router.get("/search", searchUsers);

export default router;
