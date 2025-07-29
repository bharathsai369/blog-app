import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="home-page p-6 bg-base-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📚 Latest Blogs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="card bg-base-200 shadow-xl border border-base-300"
          >
            <div className="card-body">
              <h3 className="card-title text-xl font-semibold">{blog.title}</h3>

              <div
                className="prose max-w-none line-clamp-4 text-sm text-base-content/80"
                dangerouslySetInnerHTML={{
                  __html: blog.body.slice(0, 300) + "...",
                }}
              />

              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags?.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="badge badge-accent badge-outline text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="card-actions justify-end mt-4">
                <Link to={`/blogs/${blog._id}`} className="btn btn-primary btn-sm">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
