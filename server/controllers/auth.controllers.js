import UserModel from "../models/user.Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// http://localhost:3000/api/auth/register
export const registerUser = async (req, res) => {
  try {
    if (process.env.ALLOW_ADMIN_REGISTER !== "true") {
      return res.status(403).json({
        success: false,
        message: "Admin registration is disabled",
      });
    }
    const existingAdmin = await UserModel.findOne({ role: "admin" });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin account already exists",
      });
    }
    const { name, email, password } = req.body;
    name = name.trim;
    email = email.trim.toLowerCase();
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const userData = user.toObject();
    delete userData.password;
    return res.status(200).json({
      success: true,
      message: "User registered",
      data: userData,
      token,
    });
  } catch (error) {
    console.error(error, "Error in register user");
    res
      .status(500)
      .json({ success: false, message: "Server error!", data: error });
  }
};

// http://localhost:3000/api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    email = email.trim().toLowerCase();
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (user !== "admin") return res.status(403).json("Access Denied");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const userData = user.toObject();
    delete userData.password;

    return res
      .status(200)
      .json({ success: true, message: "User logged in", data: user, token });
  } catch (error) {
    console.error(error, "in login user");
    res
      .status(500)
      .json({ success: false, message: "Server error!", data: error });
  }
};
