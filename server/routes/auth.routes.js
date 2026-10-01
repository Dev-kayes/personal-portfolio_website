import express from "express";
import { registerUser, testApi } from "../controllers/auth.controllers.js";
const authRouter = express.Router();
// testing
authRouter.get("/test", testApi);
// register
authRouter.post("/register", registerUser);

export default authRouter;
