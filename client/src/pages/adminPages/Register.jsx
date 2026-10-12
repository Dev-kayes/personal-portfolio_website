import React, { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../redux/userSlice";

// New imports for UI enhancements
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiLoader,
  FiLayers,
} from "react-icons/fi";

const Register = () => {
  // ==========================================
  // EXISTING LOGIC PRESERVED EXACTLY
  // ==========================================
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const serverURI = import.meta.env.VITE_SERVER_URI;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerUserHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${serverURI}/api/auth/register`, {
        name,
        email,
        password,
      });
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        toast.success(
          response?.data?.message || "User registered successfully",
        );
        navigate("/admin");
        setLoading(false);
      } else {
        toast.error(response?.data?.message || "something went wrong");
        setLoading(false);
      }
    } catch (error) {
      console.error(error, "error in register user");
      toast.error(error?.response?.data?.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    if (token) {
      navigate("/admin");
    }
  }, [token, navigate]);
  // ==========================================

  return (
    <div className="min-h-screen flex w-full bg-[#F9F9F8] font-sans">
      {/* LEFT PANEL: Brand Presentation (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B0F19] relative overflow-hidden flex-col justify-between p-12 lg:p-16 xl:p-24 text-white">
        {/* Subtle CSS Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        {/* Decorative Abstract Element */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[50%] rounded-full bg-gradient-to-br from-indigo-500/20 to-transparent blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
              <FiLayers className="text-xl text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              Portfolio Admin
            </span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl xl:text-5xl font-medium tracking-tight leading-[1.1] mb-6">
              Manage your work with precision.
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed font-light">
              Join the platform to unlock a powerful suite of tools designed to
              help you curate, manage, and scale your portfolio seamlessly.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} Portfolio Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Registration Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-slate-900 rounded-lg">
              <FiLayers className="text-xl text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-900">
              Portfolio Admin
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
            Create your account
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mb-8">
            Enter your details below to get started.
          </p>

          <form onSubmit={registerUserHandler} className="space-y-5">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiUser className="text-slate-400 text-lg" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all duration-200 sm:text-sm shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="text-slate-400 text-lg" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all duration-200 sm:text-sm shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="text-slate-400 text-lg" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all duration-200 sm:text-sm shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B0F19] px-4 py-3 text-sm font-medium text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/50 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <>
                  <FiLoader className="text-lg animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Register Now</span>
                  <FiArrowRight className="text-lg" />
                </>
              )}
            </button>
            <p>
              Already have an account?{" "}
              <Link
                className="text-blue-500  hover:text-[#020a4d]"
                to="/admin/login"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
