import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { setToken } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

// New imports for UI enhancements
import {
  FiMail,
  FiLock,
  FiCommand,
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";

const Login = (e) => {
  // ==========================================
  // EXISTING LOGIC PRESERVED EXACTLY
  // ==========================================
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const serverURI = import.meta.env.VITE_SERVER_URI;
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  React.useEffect(() => {
    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [token, navigate]);

  const loginUserHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${serverURI}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const userToken = response.data.token;

        localStorage.setItem("token", userToken);
        dispatch(setToken(userToken));

        toast.success(response.data.message || "User Logged in successfully");

        navigate("/admin", { replace: true });
      } else {
        toast.error(response?.data?.message || "something went wrong");
        setLoading(false);
      }
    } catch (error) {
      console.error(error, "error in Login user");
      toast.error(error?.response?.data?.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };
  // ==========================================

  return (
    <div className="min-h-screen w-full bg-[#09090B] flex items-center justify-center relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* BACKGROUND EFFECTS: Command Center Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-indigo-500/20 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none"></div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Header / Brand */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md">
            <FiCommand className="text-2xl text-white" />
          </div>
          <span className="text-indigo-400 font-medium tracking-widest text-xs uppercase mb-2">
            System Authentication
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
            Welcome back
          </h1>
          <p className="text-zinc-400 text-sm">
            Enter your credentials to access the command center.
          </p>
        </div>

        {/* Login Form Surface */}
        <div className="bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={loginUserHandler} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="text-zinc-500 text-lg" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="admin@portfolio.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="block w-full pl-10 pr-4 py-3 bg-[#09090B] border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="text-zinc-500 text-lg" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="block w-full pl-10 pr-4 py-3 bg-[#09090B] border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#09090B] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="text-lg animate-spin text-black/70" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Initialize Session</span>
                  <FiArrowRight className="text-lg opacity-70" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info (Optional Context) */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              className="text-blue-500  hover:text-[#020a4d]"
              to="/admin/register"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
