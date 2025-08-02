// components/Layout.jsx
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <aside className="lg:w-1/4 order-2 lg:order-1">
            <div className="sticky top-6">
              <LeftSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 order-1 lg:order-2">
            {children}
          </main>

          {/* Right Sidebar */}
          <aside className="lg:w-1/4 order-3">
            <div className="sticky top-6">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
