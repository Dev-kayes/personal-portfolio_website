import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router";
import { setToken } from "../../redux/userSlice";
import { useDispatch } from "react-redux";

const Login = (e) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const serverURI = import.meta.env.VITE_SERVER_URI;
  const dispatch = useDispatch();
  const loginUserHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${serverURI}/api/auth/login`, {
        email,
        password,
      });
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        toast.success(
          response?.data?.message || "User Loggged in successfully",
        );
        (navigate("/admin"), setLoading(false));
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
  return (
    <>
      <form onSubmit={loginUserHandler}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit">{loading ? "Loading..." : "Login Now"}</button>
      </form>
    </>
  );
};

export default Login;
