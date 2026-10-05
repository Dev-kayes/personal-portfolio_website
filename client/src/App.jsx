import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/admin/Home";
import Login from "./pages/admin/Login";
import Register from "./pages/admin/Register";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/admin">
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
