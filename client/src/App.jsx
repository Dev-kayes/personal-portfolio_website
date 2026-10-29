import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/adminPages/Home";
import Login from "./pages/adminPages/Login";
import Register from "./pages/adminPages/Register";
import { Toaster } from "react-hot-toast";
import useFetchedUserData from "../hooks/userFetchedUserData";
import DashBoard from "./pages/adminPages/DashBoard";
import Profile from "./pages/adminPages/Profile";
import Projects from "./pages/adminPages/Projects";
import Experience from "./pages/adminPages/Experience";
import Skills from "./pages/adminPages/Skills";
import Education from "./pages/adminPages/Education";
import Achievements from "./pages/adminPages/Achievements";

// Client Component Imports
import ClientBanner from "./pages/clientPages/ClientBanner";
import ClientNavbar from "./components/clientComponents/ClientNavbar";

// Function for Background Image rotation:
function GalaxyBackground() {
  return (
    <div className="galaxy-background" aria-hidden="true">
      <img src="/galaxy.png" alt="" />
    </div>
  );
}

// Local Wrapper Component for your public portfolio view
const ClientLayout = () => {
  return (
    <div className="text-slate-100 min-h-screen">
      {/* Sticky Navigation */}
      <ClientNavbar />

      {/* Main Page Content */}
      <main className="pt-20">
        <section id="home" className="scroll-mt-24">
          <ClientBanner />
        </section>

        {/* Add placeholders for future sections as you build them */}
        <section id="about" className="scroll-mt-24 p-8 min-h-[50vh]">
          <h2 className="text-2xl font-bold">About Me</h2>
        </section>

        <section id="projects" className="scroll-mt-24 p-8 min-h-[50vh]">
          <h2 className="text-2xl font-bold">Projects</h2>
        </section>

        <section id="experience" className="scroll-mt-24 p-8 min-h-[50vh]">
          <h2 className="text-2xl font-bold">Experience</h2>
        </section>

        <section id="contact" className="scroll-mt-24 p-8 min-h-[50vh]">
          <h2 className="text-2xl font-bold">Contact</h2>
        </section>
      </main>
    </div>
  );
};

const App = () => {
  const token = localStorage.getItem("token");
  useFetchedUserData();

  return (
    <>
      <GalaxyBackground />
      <Toaster />
      <Routes>
        {/* Public Portfolio Page */}
        <Route path="/" element={<ClientLayout />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<Home />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="projects" element={<Projects />} />
          <Route path="experience" element={<Experience />} />
          <Route path="skills" element={<Skills />} />
          <Route path="education" element={<Education />} />
          <Route path="achievements" element={<Achievements />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;
