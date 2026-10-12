import React from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/userSlice";

// Icons
import { FiLogOut, FiHexagon } from "react-icons/fi";

const Navbar = () => {
  const dispatch = useDispatch();

  // Your existing logic is preserved exactly as it was
  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch(setToken(null));
    window.location.reload();
  };

  return (
    <nav className="w-full h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50 shadow-md">
      {/* Left Side: Brand & Context */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mock Logo Mark */}
        <div className="flex items-center justify-center w-8 h-8 bg-gray-800 text-indigo-400 rounded-lg border border-gray-700 shadow-sm">
          <FiHexagon className="text-xl" />
        </div>

        {/* Brand Text & Badge */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-semibold text-white tracking-tight">
            Portfolio
          </h1>
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-800 text-indigo-300 border border-gray-700">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Right Side: User Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleLogOut}
          aria-label="Log out"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
        >
          <FiLogOut className="text-lg text-gray-400 group-hover:text-white" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
