import React from "react";
import Navbar from "./../../components/admin/Navbar";
import Footer from "./../../components/admin/Footer";
import userFetchedUserData from "../../../hooks/userFetchedUserData";

const Home = () => {
  userFetchedUserData();
  return (
    <>
      <Navbar />
      <Footer />
    </>
  );
};

export default Home;
