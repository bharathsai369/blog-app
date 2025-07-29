import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to load blog:", err);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/check");
        setUser(res.data);
      } catch (err) {
        console.error("User not logged in");
      }
    };

    fetchBlog();
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`/blogs/${id}`);
        navigate("/");
      } catch (err) {
        console.error("Delete failed:", err.message);
      }
    }
  };

  if (!blog) {
    return (
      <div className="text-center mt-20 text-lg text-base-content/80">
        Loading blog...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">
      <div className="card bg-base-100 shadow-xl p-6 space-y-6 border border-base-300">
        <h1 className="text-4xl font-bold text-primary">{blog.title}</h1>

        <div className="flex justify-between items-center text-sm text-base-content/60">
          <span>
            ✍️ By <span className="font-medium">{blog.author?.username}</span>
          </span>
          <span>📅 {new Date(blog.createdAt).toLocaleString()}</span>
        </div>

        <div
          className="prose max-w-none text-sm text-base-content/80
    break-words whitespace-pre-wrap
    [&_h1]:break-words [&_h2]:break-words [&_h3]:break-words
    [&_p]:break-words [&_a]:break-all
    [&_img]:mx-auto [&_img]:my-4 [&_img]:rounded-lg [&_img]:max-w-full"
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="badge badge-outline badge-accent text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {user?._id === blog.author?._id && (
          <div className="flex gap-3 justify-end pt-6">
            <Link to={`/edit/${id}`} className="btn btn-warning btn-sm">
              ✏️ Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-sm">
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogDetail;
