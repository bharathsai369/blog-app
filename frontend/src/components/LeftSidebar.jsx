import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

const LeftSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    fetchCategories();
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/blogs/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchUserStats = async () => {
    try {
      const res = await axios.get("/blogs?author=" + user.username + "&limit=1");
      setUserStats({
        totalBlogs: res.data.pagination?.totalBlogs || 0,
      });
    } catch (err) {
      console.error("Failed to fetch user stats:", err);
    }
  };

  const quickActions = [
    { name: "Create Blog", icon: "✍️", path: "/create", requiresAuth: true },
    { name: "My Profile", icon: "👤", path: `/user/${user?.username}`, requiresAuth: true },
    { name: "Trending", icon: "🔥", path: "/?sortBy=views&sortOrder=desc" },
    { name: "Latest", icon: "🕒", path: "/?sortBy=createdAt&sortOrder=desc" },
  ];

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      {user && (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={user.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
                    alt={user.username}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </h3>
                <p className="text-sm text-base-content/70">@{user.username}</p>
              </div>
            </div>
            
            <div className="stats stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Blogs</div>
                <div className="stat-value text-primary">{userStats.totalBlogs}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-4">
          <h3 className="card-title text-lg mb-4">⚡ Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => {
              if (action.requiresAuth && !user) return null;
              return (
                <Link
                  key={action.name}
                  to={action.path}
                  className="btn btn-outline btn-sm w-full justify-start"
                >
                  <span className="text-lg mr-2">{action.icon}</span>
                  {action.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-4">
          <h3 className="card-title text-lg mb-4">📂 Categories</h3>
          <div className="space-y-2">
            <Link
              to="/"
              className="btn btn-ghost btn-sm w-full justify-start"
            >
              📄 All Posts
            </Link>
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category._id}
                to={`/?category=${category._id}`}
                className="btn btn-ghost btn-sm w-full justify-start"
              >
                <span className="mr-2">📁</span>
                {category._id}
                <span className="badge badge-primary badge-sm ml-auto">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-4">
          <h3 className="card-title text-lg mb-4">🏷️ Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {["react", "javascript", "webdev", "programming", "design", "tutorial"].map((tag) => (
              <Link
                key={tag}
                to={`/?tags=${tag}`}
                className="badge badge-outline hover:badge-primary cursor-pointer"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl border border-primary/20">
        <div className="card-body p-4">
          <h3 className="card-title text-lg mb-2">📧 Stay Updated</h3>
          <p className="text-sm text-base-content/70 mb-4">
            Get the latest blog posts and updates delivered to your inbox.
          </p>
          <div className="form-control">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered input-sm"
            />
          </div>
          <button className="btn btn-primary btn-sm w-full mt-2">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
