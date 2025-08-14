import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    avatar: {
      type: String,
      default: "",
    },
    website: {
      type: String,
    },
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Virtual for full name
userSchema.virtual("fullName").get(function() {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim() || this.username;
});

// Virtual for follower count
userSchema.virtual("followerCount").get(function() {
  return this.followers.length;
});

// Virtual for following count
userSchema.virtual("followingCount").get(function() {
  return this.following.length;
});

// Ensure virtuals are included in JSON output
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);
export default User;
