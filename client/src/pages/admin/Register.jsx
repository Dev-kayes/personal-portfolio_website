import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/userSlice";

const Register = () => {
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
        // localStorage.setItem("token", response.data.token);
        toast.success(
          response?.data?.message || "User registered successfully",
        );
        (navigate("/admin/login"), setLoading(false));
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
  return (
    <>
      <form onSubmit={registerUserHandler}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="name"
            name="name"
            id="name"
            placeholder="Enter your Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
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
        <button type="submit">{loading ? "Loading..." : "Register Now"}</button>
      </form>
    </>
  );
};

export default Register;
