// import Blog from "../models/blog.model.js";

// // Create blog
// export const createBlog = async (req, res) => {
//   try {
//     const { title, body, category, tags } = req.body;

//     const newBlog = new Blog({ title, body, category, tags });
//     await newBlog.save();

//     res.status(201).json(newBlog);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create blog", message: err.message });
//   }
// };

// // Get all blogs
// export const getBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find().sort({ createdAt: -1 });
//     res.json(blogs);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch blogs" });
//   }
// };

// // Get single blog by ID
// export const getBlogById = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ error: "Blog not found" });
//     res.json(blog);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch blog" });
//   }
// };

// // Update blog
// export const updateBlog = async (req, res) => {
//   try {
//     const updated = await Blog.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, updatedAt: Date.now() },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update blog" });
//   }
// };

// // Delete blog
// export const deleteBlog = async (req, res) => {
//   try {
//     await Blog.findByIdAndDelete(req.params.id);
//     res.json({ message: "Blog deleted" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete blog" });
//   }
// };

// blog.controller.js
import Blog from "../models/blog.model.js";

// Create blog
export const createBlog = async (req, res) => {
  try {
    const { title, body, category, tags } = req.body;

    const newBlog = new Blog({
      title,
      body,
      category,
      tags,
      author: req.user._id,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create blog", message: err.message });
  }
};

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username email"
    ); // Only include what you need
    console.log(blog)
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this blog" });
    }

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
};
