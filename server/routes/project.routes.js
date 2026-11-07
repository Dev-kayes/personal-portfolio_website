import express from "express";
import { isAuth } from "../middleWare/isAuth.js";
import upload from "./../middleWare/multer.js";
import {
  addProject,
  deleteProject,
  getAdminProject,
  getPublicProjects,
} from "../controllers/project.controllers.js";
const projectRoute = express.Router();

projectRoute.post("/add", isAuth, upload.single("projectImage"), addProject);

projectRoute.delete("/delete-projects/:projectId", isAuth, deleteProject);

projectRoute.get("/get-admin-projects", isAuth, getAdminProject);
projectRoute.get("/public", getPublicProjects);

export default projectRoute;
