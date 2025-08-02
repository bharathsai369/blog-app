import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${id}`);
      setBlog(res.data);
      setIsLiked(res.data.likes?.includes(user?._id) || false);
      setLikesCount(res.data.likes?.length || 0);
    } catch (err) {
      console.error("Failed to load blog:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(`/blogs/${id}/like`);
      setIsLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error("Failed to like blog:", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await axios.post(`/blogs/${id}/comments`, {
        content: comment,
      });
      
      // Add the new comment to the blog
      setBlog(prev => ({
        ...prev,
        comments: [...prev.comments, res.data]
      }));
      
      setComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/blogs/${id}/comments/${commentId}`);
      setBlog(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      }));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

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

  const shareBlog = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt || "Check out this amazing blog post!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold mb-2">Blog Not Found</h2>
        <p className="text-base-content/70 mb-4">The blog you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Blog Header */}
      <div className="card bg-base-100 shadow-xl mb-8">
        {blog.featuredImage && (
          <figure className="h-64 md:h-96">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </figure>
        )}
        
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full">
                <img
                  src={blog.author?.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
                  alt={blog.author?.username}
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold">
                {blog.author?.firstName && blog.author?.lastName
                  ? `${blog.author.firstName} ${blog.author.lastName}`
                  : blog.author?.username}
              </h3>
              <p className="text-sm text-base-content/70">
                {dayjs(blog.createdAt).format("MMM D, YYYY")} • {blog.readTime} min read
              </p>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          
          {blog.excerpt && (
            <p className="text-lg text-base-content/70 mb-4">{blog.excerpt}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="badge badge-primary">{blog.category}</span>
            {blog.tags?.map((tag, i) => (
              <span key={i} className="badge badge-outline">
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleLike}
              className={`btn ${isLiked ? "btn-primary" : "btn-outline"}`}
            >
              <span className="text-lg mr-2">{isLiked ? "❤️" : "🤍"}</span>
              {likesCount} {isLiked ? "Liked" : "Like"}
            </button>
            
            <button onClick={shareBlog} className="btn btn-outline">
              <span className="text-lg mr-2">📤</span>
              Share
            </button>

            {user?._id === blog.author?._id && (
              <div className="flex gap-2 ml-auto">
                <Link to={`/edit/${id}`} className="btn btn-warning btn-sm">
                  ✏️ Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-error btn-sm">
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>

          {/* Blog Stats */}
          <div className="flex items-center gap-6 text-sm text-base-content/60">
            <span>👁️ {blog.views} views</span>
            <span>💬 {blog.comments?.length || 0} comments</span>
            <span>📖 {blog.readTime} min read</span>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div
            className="prose max-w-none text-base-content
              [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl
              [&_p]:text-base [&_a]:text-primary
              [&_img]:mx-auto [&_img]:my-4 [&_img]:rounded-lg [&_img]:max-w-full
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4
              [&_code]:bg-base-200 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded"
            dangerouslySetInnerHTML={{ __html: blog.body }}
          />
        </div>
      </div>

      {/* Comments Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-2xl mb-6">
            💬 Comments ({blog.comments?.length || 0})
          </h3>

          {/* Add Comment */}
          {user ? (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-3">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <img
                      src={user.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
                      alt={user.username}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !comment.trim()}
                    className="btn btn-primary btn-sm mt-2"
                  >
                    {submittingComment ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Posting...
                      </>
                    ) : (
                      "Post Comment"
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="alert alert-info mb-8">
              <span>Please log in to leave a comment.</span>
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {blog.comments?.length === 0 ? (
              <div className="text-center py-8 text-base-content/60">
                <div className="text-4xl mb-2">💭</div>
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              blog.comments?.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img
                        src={comment.author?.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
                        alt={comment.author?.username}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-base-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {comment.author?.firstName && comment.author?.lastName
                            ? `${comment.author.firstName} ${comment.author.lastName}`
                            : comment.author?.username}
                        </span>
                        <span className="text-xs text-base-content/60">
                          {dayjs(comment.createdAt).fromNow()}
                        </span>
                      </div>
                      <p className="text-base-content">{comment.content}</p>
                    </div>
                    
                    {/* Delete comment button for author or blog owner */}
                    {(user?._id === comment.author?._id || user?._id === blog.author?._id) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="btn btn-ghost btn-xs mt-2 text-error"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
