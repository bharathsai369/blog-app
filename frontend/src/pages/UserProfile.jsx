import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`/auth/user/${username}`);
      setProfile(res.data.user);
      setBlogs(res.data.blogs);
      setFollowersCount(res.data.user.followerCount || 0);
      setFollowingCount(res.data.user.followingCount || 0);
      
      // Check if current user is following this profile
      if (currentUser) {
        setIsFollowing(res.data.user.followers?.some(f => f._id === currentUser._id) || false);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      // Redirect to login
      return;
    }

    try {
      const res = await axios.post(`/auth/follow/${username}`);
      setIsFollowing(res.data.following);
      setFollowersCount(prev => res.data.following ? prev + 1 : prev - 1);
    } catch (err) {
      console.error("Failed to follow user:", err);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`/blogs/${blogId}`);
        setBlogs(prev => prev.filter(blog => blog._id !== blogId));
      } catch (err) {
        console.error("Failed to delete blog:", err);
      }
    }
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

  if (!profile) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">👤</div>
        <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
        <p className="text-base-content/70">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profile._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full">
                <img
                  src={profile.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"}
                  alt={profile.username}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {profile.firstName && profile.lastName
                    ? `${profile.firstName} ${profile.lastName}`
                    : profile.username}
                </h1>
                {profile.isVerified && (
                  <span className="badge badge-primary">✓ Verified</span>
                )}
              </div>
              
              <p className="text-base-content/70 mb-2">@{profile.username}</p>
              
              {profile.bio && (
                <p className="text-base-content/80 mb-4">{profile.bio}</p>
              )}

              <div className="flex items-center gap-6 mb-4">
                <div className="stat">
                  <div className="stat-title">Blogs</div>
                  <div className="stat-value text-primary">{blogs.length}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Followers</div>
                  <div className="stat-value text-secondary">{followersCount}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Following</div>
                  <div className="stat-value">{followingCount}</div>
                </div>
              </div>

              <div className="flex gap-3">
                {!isOwnProfile && currentUser && (
                  <button
                    onClick={handleFollow}
                    className={`btn ${isFollowing ? "btn-outline" : "btn-primary"}`}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
                
                {isOwnProfile && (
                  <Link to="/create" className="btn btn-primary">
                    ✍️ Create Blog
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Blogs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            📝 {isOwnProfile ? "My Blogs" : `${profile.username}'s Blogs`} ({blogs.length})
          </h2>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">
              {isOwnProfile ? "You haven't written any blogs yet" : "No blogs yet"}
            </h3>
            <p className="text-base-content/70 mb-4">
              {isOwnProfile 
                ? "Start sharing your thoughts with the world!" 
                : "This user hasn't published any blogs yet."
              }
            </p>
            {isOwnProfile && (
              <Link to="/create" className="btn btn-primary">
                Write Your First Blog
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                {blog.featuredImage && (
                  <figure className="h-48">
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                )}
                
                <div className="card-body">
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

                  <div className="flex items-center justify-between mt-4 text-sm text-base-content/60">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        👁️ {blog.views}
                      </span>
                      <span className="flex items-center gap-1">
                        ❤️ {blog.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        ⏱️ {blog.readTime} min
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link to={`/blogs/${blog._id}`} className="btn btn-primary btn-sm">
                        Read
                      </Link>
                      {isOwnProfile && (
                        <>
                          <Link to={`/edit/${blog._id}`} className="btn btn-outline btn-sm">
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="btn btn-outline btn-sm text-error"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 