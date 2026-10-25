import express from "express";
import { isAuth } from "../middleWare/isAuth.js";
import {
  addExperience,
  deleteExperience,
  getAdminExperience,
} from "../controllers/experience.controller.js";
const experienceRoute = express.Router();

// Add experience:
// http://localhost:3000/api/experience/add-exp
// https://kayesbackend.vercel.app/api/experience/add-exp
experienceRoute.post("/add-exp", isAuth, addExperience);

// Get admin experience:
// http://localhost:3000/api/experience/get-admin-exp
// https://kayesbackend.vercel.app/api/experience/get-admin-exp
experienceRoute.get("/get-admin-exp", isAuth, getAdminExperience);

// Delete experience:
// http://localhost:3000/api/experience/del-exp/:expId
// https://kayesbackend.vercel.app/api/experience/del-exp/:expId
experienceRoute.delete("/del-exp/:expId", isAuth, deleteExperience);

export default experienceRoute;
