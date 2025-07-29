import express from "express";
import {
  signup,
  login,
  logout,
  //   updateProfile,
  checkAuth,
  profileRoute,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup); // POST /api/auth/register
router.post("/login", login); // POST /api/auth/login
router.post("/logout", logout);

// router.put("/update-profile", protectRoute, updateProfile);

router.get("/profile", protectRoute, profileRoute);

router.get("/check", protectRoute, checkAuth);

export default router;
