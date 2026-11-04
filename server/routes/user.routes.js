import express from "express";
import {
  getCurrentUser,
  getPublicProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuth } from "../middleWare/isAuth.js";
import upload from "../middleWare/multer.js";
const userRoute = express.Router();

userRoute.get("/public", getPublicProfile);

// current user:
// http://localhost:3000/api/user/current-user
// https://kayesbackend.vercel.app/api/user/current-user
userRoute.get("/current-user", isAuth, getCurrentUser);

// update user:
// http://localhost:3000/api/user/update-profile
// https://kayesbackend.vercel.app/api/user/update-profile
userRoute.put(
  "/update-profile",
  isAuth,
  upload.single("profile"),
  updateProfile,
);

export default userRoute;
