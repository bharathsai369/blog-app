import { generateToken } from "../config/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
// import cloudinary from "../lib/cloudinary.js";

// Signup
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      // profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      // profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout
const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const profileRoute = (req, res) => {
  try {
    const isAdmin = req.user;
    console.log(isAdmin);
    if (!isAdmin.isAdmin) {
      res.json(isAdmin);
    } else {
      res.json(isAdmin);
    }
  } catch (error) {
    console.log(error);
  }
};

// Update profile pic
// const updateProfile = async (req, res) => {
//   const { profilePic } = req.body;
//   const userId = req.user._id;

//   try {
//     if (!profilePic) {
//       return res.status(400).json({ message: "Profile pic is required" });
//     }

//     const uploadRes = await cloudinary.uploader.upload(profilePic, {
//       folder: "Rine/profile_pics",
//       public_id: `user_${userId}_profile`,
//       overwrite: true,
//     });

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: uploadRes.secure_url },
//       { new: true }
//     );

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error("Error in updateProfile:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// Check auth (for frontend to verify)
const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  signup,
  login,
  logout,
  profileRoute,
  //  updateProfile,
  checkAuth,
};
