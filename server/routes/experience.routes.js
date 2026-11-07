import express from "express";
import { isAuth } from "../middleWare/isAuth.js";
import {
  addExperience,
  deleteExperience,
  getAdminExperience,
  getPublicExperience,
} from "../controllers/experience.controller.js";
const experienceRoute = express.Router();

experienceRoute.post("/add-exp", isAuth, addExperience);

experienceRoute.get("/get-admin-exp", isAuth, getAdminExperience);
experienceRoute.get("/public", getPublicExperience);

experienceRoute.delete("/del-exp/:expId", isAuth, deleteExperience);

export default experienceRoute;
