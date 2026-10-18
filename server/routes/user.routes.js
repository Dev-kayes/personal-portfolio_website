import express from "express";
import {
  getCurrentUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuth } from "../middleWare/isAuth.js";
import upload from "../middleWare/multer.js";
const userRoute = express.Router();

// current user:
// http://localhost:3000/api/user/current-user
userRoute.get("/current-user", isAuth, getCurrentUser);

// update user:
// http://localhost:3000/api/user/update-profile
userRoute.put(
  "/update-profile",
  isAuth,
  upload.single("profile"),
  updateProfile,
);

export default userRoute;
