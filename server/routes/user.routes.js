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

userRoute.get("/current-user", isAuth, getCurrentUser);

userRoute.put(
  "/update-profile",
  isAuth,
  upload.single("profile"),
  updateProfile,
);

export default userRoute;
