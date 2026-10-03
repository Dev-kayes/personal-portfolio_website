import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import { isAuth } from "../middleWare/isAuth.js";
const userRoute = express.Router();

// current user:
userRoute.get("/current-user", isAuth, getCurrentUser);

export default userRoute;
