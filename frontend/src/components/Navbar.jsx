import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="navbar bg-base-100 shadow-lg border-b border-base-300 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/" className={isActive("/") ? "active" : ""}>🏠 Home</Link></li>
            <li><Link to="/create" className={isActive("/create") ? "active" : ""}>✍️ Create</Link></li>
            {user && (
              <li><Link to={`/user/${user.username}`} className={isActive(`/user/${user.username}`) ? "active" : ""}>👤 Profile</Link></li>
            )}
          </ul>
        </div>
        
        <Link to="/" className="btn btn-ghost text-xl">
          📚 BlogApp
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link 
              to="/" 
              className={`${isActive("/") ? "active" : ""} flex items-center gap-2`}
            >
              🏠 Home
            </Link>
          </li>
          <li>
            <Link 
              to="/create" 
              className={`${isActive("/create") ? "active" : ""} flex items-center gap-2`}
            >
              ✍️ Create
            </Link>
          </li>
          {user && (
            <li>
              <Link 
                to={`/user/${user.username}`} 
                className={`${isActive(`/user/${user.username}`) ? "active" : ""} flex items-center gap-2`}
              >
                👤 Profile
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex mr-4">
          <div className="join">
            <input
              type="text"
              placeholder="Search blogs..."
              className="input input-bordered join-item w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <button type="submit" className="btn join-item">
              🔍
            </button>
          </div>
        </form>

        {/* User Menu */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img 
                  alt={user.username} 
                  src={user.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"} 
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span className="text-sm font-medium">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </span>
              </li>
              <li>
                <Link to={`/user/${user.username}`} className="flex items-center gap-2">
                  👤 Profile
                </Link>
              </li>
              <li>
                <Link to="/create" className="flex items-center gap-2">
                  ✍️ Create Blog
                </Link>
              </li>
              <li>
                <button className="flex items-center gap-2 text-error" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-outline btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
