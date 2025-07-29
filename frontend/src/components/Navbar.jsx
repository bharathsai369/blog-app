import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-200 shadow sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-2xl">
          📝 MyBlog
        </Link>
      </div>

      <div className="flex-none gap-2 items-center">
        {user ? (
          <>
            <span className="font-medium hidden sm:inline">
              Hello, {user.username}
            </span>
            <button onClick={logout} className="btn btn-sm btn-outline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
