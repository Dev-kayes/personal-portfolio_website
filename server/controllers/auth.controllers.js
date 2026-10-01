import UserModel from "../models/user.Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const testApi = (req, res) => {
  res.status(200).json({ message: "API is working" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if ((!name, !email, !password)) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .json({ success: true, message: "User registered", data: user, token });
  } catch (error) {
    console.error(error, "in register user");
    res
      .status(500)
      .json({ success: false, message: "Server error!", data: error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ((!email, !password)) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
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
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
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
