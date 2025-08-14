import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";

// Create blog
export const createBlog = async (req, res) => {
  try {
    const { title, body, category, tags, excerpt, featuredImage } = req.body;

    const newBlog = new Blog({
      title,
      body,
      category,
      tags,
      excerpt,
      featuredImage,
      author: req.user._id,
    });

    await newBlog.save();
    
    // Populate author info for response
    await newBlog.populate("author", "username firstName lastName avatar");
    
    res.status(201).json(newBlog);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create blog", message: err.message });
  }
};

// Get all blogs with advanced filtering
export const getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      tags,
      author,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { isPublished: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(",").map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Filter by author
    if (author) {
      const authorUser = await User.findOne({ username: author });
      if (authorUser) {
        query.author = authorUser._id;
      }
    }

    // Sorting options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find(query)
      .populate("author", "username firstName lastName avatar")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalBlogs: total,
        hasNext: skip + blogs.length < total,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs", message: err.message });
  }
};

// Get trending blogs
export const getTrendingBlogs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Get blogs from last 7 days with high engagement
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendingBlogs = await Blog.find({
      isPublished: true,
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate("author", "username firstName lastName avatar")
      .sort({ views: -1, "likes.length": -1 })
      .limit(parseInt(limit));

    res.json(trendingBlogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trending blogs", message: err.message });
  }
};

// Get featured blogs
export const getFeaturedBlogs = async (req, res) => {
  try {
    const { limit = 3 } = req.query;
    
    const featuredBlogs = await Blog.find({
      isPublished: true,
      isFeatured: true,
    })
      .populate("author", "username firstName lastName avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(featuredBlogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch featured blogs", message: err.message });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories", message: err.message });
  }
};

// Get tags
export const getTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tags", message: err.message });
  }
};

// Get single blog by ID with view increment
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username firstName lastName avatar bio")
      .populate("comments.author", "username firstName lastName avatar");

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog", message: err.message });
  }
};

// Like/Unlike blog
export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const userId = req.user._id;
    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId.toString());
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json({ 
      liked: !isLiked, 
      likesCount: blog.likes.length,
      message: !isLiked ? "Blog liked!" : "Blog unliked!"
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle like", message: err.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const comment = {
      author: req.user._id,
      content,
      createdAt: new Date(),
    };

    blog.comments.push(comment);
    await blog.save();

    // Populate the new comment's author info
    await blog.populate("comments.author", "username firstName lastName avatar");

    const newComment = blog.comments[blog.comments.length - 1];
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment", message: err.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // Check if user is comment author or blog author
    if (comment.author.toString() !== req.user._id.toString() && 
        blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    comment.deleteOne();
    await blog.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment", message: err.message });
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
    ).populate("author", "username firstName lastName avatar");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog", message: err.message });
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
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog", message: err.message });
  }
};
