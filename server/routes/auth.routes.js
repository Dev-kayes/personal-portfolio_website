import express from "express";
import {
  loginUser,
  registerUser,
  testApi,
} from "../controllers/auth.controllers.js";
const authRouter = express.Router();
// testing
// http://localhost:3000/api/auth/test
authRouter.get("/test", testApi);
// register
// http://localhost:3000/api/auth/register
authRouter.post("/register", registerUser);
// login
// http://localhost:3000/api/auth/login
authRouter.post("/login", loginUser);

export default authRouter;
