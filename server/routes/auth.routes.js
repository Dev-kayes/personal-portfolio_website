import express from "express";
import { testApi } from "../controllers/auth.controllers.js";
const authRouter = express.Router();

authRouter.get("/test", testApi);

export default authRouter;
