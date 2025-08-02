import { generateToken } from "../config/utils.js";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import bcrypt from "bcryptjs";

// Signup
const signup = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (userExists) {
      return res.status(400).json({ 
        message: userExists.email === email ? "Email already exists" : "Username already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword,
      firstName,
      lastName
    });
    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        avatar: newUser.avatar,
      }
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
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      }
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

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Error in getProfile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, website, socialLinks, avatar } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        bio,
        website,
        socialLinks,
        avatar,
        lastActive: new Date(),
      },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get user by username (public profile)
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username })
      .select("-password -email")
      .populate({
        path: "followers",
        select: "username firstName lastName avatar",
      })
      .populate({
        path: "following",
        select: "username firstName lastName avatar",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's blogs
    const blogs = await Blog.find({ 
      author: user._id, 
      isPublished: true 
    })
      .populate("author", "username firstName lastName avatar")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      blogs,
    });
  } catch (error) {
    console.error("Error in getUserByUsername:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Follow/Unfollow user
const toggleFollow = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user._id;

    if (username === req.user.username) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findOne({ username });
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(currentUserId);
    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userToFollow._id.toString()
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== currentUserId.toString()
      );
    } else {
      // Follow
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUserId);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      following: !isFollowing,
      message: !isFollowing ? "User followed!" : "User unfollowed!",
    });
  } catch (error) {
    console.error("Error in toggleFollow:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
      ],
    })
      .select("username firstName lastName avatar bio")
      .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    console.error("Error in searchUsers:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Check auth (for frontend to verify)
const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
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
  getProfile,
  updateProfile,
  getUserByUsername,
  toggleFollow,
  searchUsers,
  checkAuth,
};
