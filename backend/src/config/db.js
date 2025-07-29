import mongoose from "mongoose";

const MONGO_URL =
  "mongodb://127.0.0.1:27017/blog_db?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.3" ||
  process.env.MONGO_URI;

// MongoDB Connection
export const connectDB = async () =>
  mongoose
    .connect(MONGO_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
      console.error("❌ Mongo error:", err);
      process.exit(1); //exit with failure
    });
