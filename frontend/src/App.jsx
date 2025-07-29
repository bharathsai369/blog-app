import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogDetail from "./pages/BlogDetail";
import CreateBlog from "./pages/CreateBlog";
import Layout from "./components/Layout";
import EditBlog from "./pages/EditBlog";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <Routes>
      {/* Layout-wrapped pages */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/blogs/:id"
        element={
          <Layout>
            <BlogDetail />
          </Layout>
        }
      />

      {/* Auth pages — only if NOT logged in */}
      {!user && <Route path="/login" element={<Login />} />}
      {!user && <Route path="/register" element={<Register />} />}
      {user && <Route path="/login" element={<Navigate to="/" />} />}
      {user && <Route path="/register" element={<Navigate to="/" />} />}

      {/* Create blog — only if logged in */}
      {user && <Route path="/create" element={<CreateBlog />} />}
      {!user && <Route path="/create" element={<Navigate to="/login" />} />}
      {user && <Route path="/edit/:id" element={<EditBlog />} />}
      {!user && <Route path="/edit/:id" element={<Navigate to="/login" />} />}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
