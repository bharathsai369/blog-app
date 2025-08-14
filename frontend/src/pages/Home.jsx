import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [searchParams]);

  const fetchInitialData = async () => {
    try {
      const [trendingRes, categoriesRes] = await Promise.all([
        axios.get("/blogs/trending?limit=5"),
        axios.get("/blogs/categories"),
      ]);
      setTrendingBlogs(trendingRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      const res = await axios.get(`/blogs?${params.toString()}`);
      setBlogs(res.data.blogs);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (sortBy) params.set("sortBy", sortBy);
    setSearchParams(params);
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="home-page space-y-8">
      {/* Search Section */}
      <section className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">🔍 Search & Filter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search blogs..."
              className="input input-bordered"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />

            <select
              className="select select-bordered"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat._id} ({cat.count})
                </option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Trending Blogs */}
      {trendingBlogs.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">🔥 Trending Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingBlogs.map((blog) => (
              <TrendingBlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* Main Blog Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          📝 Latest Blogs {pagination.totalBlogs && `(${pagination.totalBlogs})`}
        </h2>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">No blogs found</h3>
            <p className="text-base-content/70">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="join">
              {pagination.hasPrev && (
                <button
                  className="join-item btn"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", pagination.currentPage - 1);
                    setSearchParams(params);
                  }}
                >
                  «
                </button>
              )}
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`join-item btn ${page === pagination.currentPage ? "btn-active" : ""}`}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", page);
                    setSearchParams(params);
                  }}
                >
                  {page}
                </button>
              ))}
              
              {pagination.hasNext && (
                <button
                  className="join-item btn"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", pagination.currentPage + 1);
                    setSearchParams(params);
                  }}
                >
                  »
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// Blog Card Component
function BlogCard({ blog }) {
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {blog.featuredImage && (
        <figure className="h-48 overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </figure>
      )}
      
      <div className="card-body">
        <div className="flex items-center gap-2 mb-2">
          <div className="avatar">
            <div className="w-8 h-8 rounded-full">
              <img
                src={blog.author?.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
                alt={blog.author?.username}
              />
            </div>
          </div>
          <span className="text-sm text-base-content/70">
            {blog.author?.firstName && blog.author?.lastName
              ? `${blog.author.firstName} ${blog.author.lastName}`
              : blog.author?.username}
          </span>
        </div>

        <h3 className="card-title text-lg line-clamp-2">{blog.title}</h3>
        
        <p className="text-base-content/80 line-clamp-3">
          {blog.excerpt || stripHtml(blog.body).substring(0, 150)}...
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="badge badge-primary">{blog.category}</span>
          {blog.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="badge badge-outline text-xs">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-base-content/60">
          <span>📖 {blog.readTime} min read</span>
          <span>👁️ {blog.views} views</span>
          <span>❤️ {blog.likes?.length || 0} likes</span>
        </div>

        <div className="card-actions justify-end mt-4">
          <Link to={`/blogs/${blog._id}`} className="btn btn-primary btn-sm">
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Trending Blog Card Component
function TrendingBlogCard({ blog }) {
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/20">
      {blog.featuredImage && (
        <figure className="h-32 overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </figure>
      )}
      
      <div className="card-body p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="avatar">
            <div className="w-6 h-6 rounded-full">
              <img
                src={blog.author?.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
                alt={blog.author?.username}
              />
            </div>
          </div>
          <span className="text-xs text-base-content/70">
            {blog.author?.firstName && blog.author?.lastName
              ? `${blog.author.firstName} ${blog.author.lastName}`
              : blog.author?.username}
          </span>
        </div>

        <h3 className="card-title text-base line-clamp-2">{blog.title}</h3>
        
        <p className="text-sm text-base-content/80 line-clamp-2">
          {blog.excerpt || stripHtml(blog.body).substring(0, 100)}...
        </p>

        <div className="flex justify-between items-center mt-3 text-xs text-base-content/60">
          <span>👁️ {blog.views}</span>
          <span>❤️ {blog.likes?.length || 0}</span>
          <span>📖 {blog.readTime} min</span>
        </div>

        <div className="card-actions justify-end mt-3">
          <Link to={`/blogs/${blog._id}`} className="btn btn-primary btn-xs">
            Read →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
