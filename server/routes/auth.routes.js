import express from "express";
import {
  loginUser,
  registerUser,
  testApi,
} from "../controllers/auth.controllers.js";
const authRouter = express.Router();
// testing
authRouter.get("/test", testApi);
// register
authRouter.post("/register", registerUser);
// login
authRouter.post("/login", loginUser);

export default authRouter;
