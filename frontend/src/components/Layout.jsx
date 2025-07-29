// components/Layout.jsx
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div
      className="hero min-h-screen bg-base-100 text-base-content flex flex-col items-center"
      // style={{
      //   backgroundImage:
      //     "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
      //     objectFit:"contain"
      // }}
    >
      {/* <div className="min-h-screen bg-base-100 text-base-content flex flex-col items-center"> */}
      <div className="w-full lg:w-11/12">
        <Navbar />
      </div>

      <div className="border w-full lg:w-11/12 px-4 py-6 flex flex-col lg:flex-row gap-4">
        {/* <aside className="lg:w-1/5 order-2 lg:order-1">
          <LeftSidebar />
        </aside> */}

        <main className="flex-1 order-1 lg:order-2 border rounded p-4 bg-base-200">
          {children}
        </main>

        <aside className="lg:w-1/5 order-2">
          <RightSidebar />
        </aside>
      </div>

      <div className="w-full lg:w-11/12">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
