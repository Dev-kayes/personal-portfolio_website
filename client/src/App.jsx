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

const App = () => {
  const token = localStorage.getItem("token");
  useFetchedUserData();
  return (
    <>
      <Toaster />
      <Routes>
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

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;
