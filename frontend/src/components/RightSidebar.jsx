import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const RightSidebar = () => {
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSidebarData();
  }, []);

  const fetchSidebarData = async () => {
    try {
      const [trendingRes, featuredRes] = await Promise.all([
        axios.get("/blogs/trending?limit=3"),
        axios.get("/blogs/featured?limit=2"),
      ]);
      setTrendingBlogs(trendingRes.data);
      setFeaturedBlogs(featuredRes.data);
    } catch (err) {
      console.error("Failed to fetch sidebar data:", err);
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body p-4">
            <div className="skeleton h-4 w-3/4 mb-2"></div>
            <div className="skeleton h-4 w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trending Blogs */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-4">
          <h3 className="card-title text-lg mb-4">🔥 Trending</h3>
          <div className="space-y-4">
            {trendingBlogs.map((blog, index) => (
              <div key={blog._id} className="flex gap-3">
                <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="font-medium hover:text-primary line-clamp-2"
                  >
                    {blog.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-xs text-base-content/60">
                    <span>👁️ {blog.views}</span>
                    <span>❤️ {blog.likes?.length || 0}</span>
                    <span>📖 {blog.readTime} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && (
        <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl border border-primary/20">
          <div className="card-body p-4">
            <h3 className="card-title text-lg mb-4">⭐ Featured</h3>
            <div className="space-y-4">
              {featuredBlogs.map((blog) => (
                <div key={blog._id} className="space-y-2">
                  {blog.featuredImage && (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  )}
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="font-medium hover:text-primary line-clamp-2"
                  >
                    {blog.title}
                  </Link>
                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {blog.excerpt || stripHtml(blog.body).substring(0, 80)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-4">
          <h3 className="card-title text-lg mb-4">📊 Quick Stats</h3>
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Total Views</div>
              <div className="stat-value text-primary">2.6M</div>
              <div className="stat-desc">↗︎ 400 (22%)</div>
            </div>
            <div className="stat">
              <div className="stat-title">Active Writers</div>
              <div className="stat-value text-secondary">1,200</div>
              <div className="stat-desc">↗︎ 90 (14%)</div>
            </div>
            <div className="stat">
              <div className="stat-title">New Posts</div>
              <div className="stat-value">573</div>
              <div className="stat-desc">↗︎ 201 (54%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-4">
          <h3 className="card-title text-lg mb-4">🌐 Follow Us</h3>
          <div className="flex gap-2">
            <button className="btn btn-circle btn-outline">
              <span className="text-xl">🐦</span>
            </button>
            <button className="btn btn-circle btn-outline">
              <span className="text-xl">📘</span>
            </button>
            <button className="btn btn-circle btn-outline">
              <span className="text-xl">📷</span>
            </button>
            <button className="btn btn-circle btn-outline">
              <span className="text-xl">💼</span>
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="card bg-accent text-accent-content shadow-xl">
        <div className="card-body p-4">
          <h3 className="card-title text-lg mb-2">📰 Weekly Digest</h3>
          <p className="text-sm mb-4">
            Get the best blog posts delivered to your inbox every week.
          </p>
          <div className="form-control">
            <input
              type="email"
              placeholder="your@email.com"
              className="input input-bordered input-sm"
            />
          </div>
          <button className="btn btn-primary btn-sm w-full mt-2">
            Subscribe
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-4">
          <h3 className="card-title text-lg mb-4">🕒 Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E" alt="User" />
                </div>
              </div>
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-base-content/70">Published a new blog</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E" alt="User" />
                </div>
              </div>
              <div>
                <div className="font-medium">Jane Smith</div>
                <div className="text-sm text-base-content/70">Liked a blog post</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E" alt="User" />
                </div>
              </div>
              <div>
                <div className="font-medium">Mike Johnson</div>
                <div className="text-sm text-base-content/70">Commented on a blog</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
