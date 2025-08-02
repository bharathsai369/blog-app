import mongoose from "mongoose";

const MONGO_URL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blog_db";

// MongoDB Connection
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Mongo error:", err);
    process.exit(1); //exit with failure
  }
};
