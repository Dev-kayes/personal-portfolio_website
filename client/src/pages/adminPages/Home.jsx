import React from "react";
import Navbar from "./../../components/adminComponents/Navbar";
import Footer from "./../../components/adminComponents/Footer";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import AdminLoader from "../../utils/AdminLoader";
import SideBar from "../../components/adminComponents/SideBar";

const Home = () => {
  const { userData, loading, token } = useSelector((state) => state.user);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading || !userData) {
    return <AdminLoader />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <SideBar />
        <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          <div className="flex-1 p-6 lg:p-8">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Home;
